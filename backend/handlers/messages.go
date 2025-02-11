package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections (for development only)
	},
}

// Store active users and their WebSocket connections
var users = make(map[string]*websocket.Conn)
var onlineUsers = make(map[string]bool)
var mutex = &sync.Mutex{} // Mutex to protect concurrent access to the users map

type Message struct {
	SenderID   string `json:"senderId"`
	ReceiverID string `json:"receiverId"`
	Message    string `json:"message"`
}

// Online status structure
type OnlineStatus struct {
	UserID string `json:"userId"`
	Online bool   `json:"online"`
}

func broadcastOnlineStatus(userID string, online bool) {
	status := OnlineStatus{
		UserID: userID,
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
	userID := string(msg)

	// Add user to the active users list
	mutex.Lock()
	users[userID] = conn
	onlineUsers[userID] = true
	mutex.Unlock()

	// Broadcast that the user is online
	broadcastOnlineStatus(userID, true)
	log.Println("User connected:", userID)

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
		tx, err := h.Users.DB.Begin()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		// Save the message to the database
		if err := h.Users.SaveMessage(tx, message.SenderID, message.ReceiverID, message.Message); err != nil {
			log.Println("Error saving message:", err)
			continue
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
	delete(users, userID)
	delete(onlineUsers, userID)
	mutex.Unlock()

	// Broadcast that the user is offline
	broadcastOnlineStatus(userID, false)
	log.Println("User disconnected:", userID)
}
