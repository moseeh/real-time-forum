package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"real-time-forum/backend/utils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections (for development only)
	},
}

// Store active users and their WebSocket connections
var (
	users       = make(map[string]*websocket.Conn)
	OnlineUsers = make(map[string]bool)
	mutex       = &sync.Mutex{} // Mutex to protect concurrent access to the users map
)

type Message struct {
	SenderID   string      `json:"senderId"`
	Sendername string      `json:"sendername"`
	ReceiverID string      `json:"receiverId"`
	Message    string      `json:"message"`
	Typing     bool        `json:"istyping"`
	Type       string      `json:"type,omitempty"`
	Post       interface{} `json:"post,omitempty"`
}

type Newuser struct {
	UserID string `json:"senderId"`
	Name   string `json:"name"`
}

// Online status structure
type OnlineStatus struct {
	UserID string `json:"userId"`
	Name   string `json:"name"`
	Online bool   `json:"online"`
}

func broadcastOnlineStatus(userID, name string, online bool) {
	status := OnlineStatus{
		UserID: userID,
		Name:   name,
		Online: online,
	}
	statusJSON, _ := json.Marshal(status)

	mutex.Lock()
	defer mutex.Unlock()
	for _, conn := range users {
		conn.WriteMessage(websocket.TextMessage, statusJSON)
	}
}

func (h *Handler) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	// Read user ID from the client
	_, msg, err := conn.ReadMessage()
	if err != nil {
		log.Println("Error reading user ID:", err)
		return
	}

	var user Newuser
	if err := json.Unmarshal(msg, &user); err != nil {
		log.Println("Error parsing message:", err)
	}

	// Add user to the active users list
	mutex.Lock()
	users[user.UserID] = conn
	OnlineUsers[user.UserID] = true
	mutex.Unlock()

	// Broadcast that the user is online
	broadcastOnlineStatus(user.UserID, user.Name, true)
	log.Println("User connected:", user)

	// Listen for incoming messages
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}

		// Parse the message
		var message Message
		if err := json.Unmarshal(msg, &message); err != nil {
			log.Println("Error parsing message:", err)
			continue
		}

		if message.Typing {
			mutex.Lock()
			if receiverConn, ok := users[message.ReceiverID]; ok {
				if err := receiverConn.WriteJSON(message); err != nil {
					log.Println("Error sending message to receiver:", err)
				}
			}
			mutex.Unlock()
			continue
		}

		tx, err := h.Users.DB.Begin()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		messageid := utils.UUIDGen()

		// Save the message to the database
		if err := h.Users.SaveMessage(tx, messageid, message.SenderID, message.ReceiverID, message.Message); err != nil {
			log.Println("Error saving message:", err)
			continue
		}
		if err := tx.Commit(); err != nil {
			http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
			return
		}

		// Send the message to the receiver if they are online
		mutex.Lock()
		if receiverConn, ok := users[message.ReceiverID]; ok {
			if err := receiverConn.WriteJSON(message); err != nil {
				log.Println("Error sending message to receiver:", err)
			}
		}
		mutex.Unlock()
	}

	// Remove user from the active users list when they disconnect
	mutex.Lock()
	delete(users, user.UserID)
	delete(OnlineUsers, user.UserID)
	mutex.Unlock()

	// Broadcast that the user is offline
	broadcastOnlineStatus(user.UserID, user.Name, false)
	log.Println("User disconnected:", user)
}

type Twousers struct {
	User1 string `json:"senderId"`
	User2 string `json:"receiverId"`
}

func (h *Handler) FetchMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var data Twousers
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	messages, err := h.Users.GetAllMessages(data.User1, data.User2)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(messages)
}
