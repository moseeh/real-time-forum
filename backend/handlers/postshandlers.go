package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"real-time-forum/backend/models"
	"real-time-forum/backend/utils"
)

type CreatePostRequest struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type CreatePostResponse struct {
	PostID  string `json:"post_id"`
	Message string `json:"message"`
}

func (h *Handler) CreatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	sessionid, err := r.Cookie("session_id")
	if err != nil {
		fmt.Println(1)

		// json respose to be implemented
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	user_id, err := h.Users.GetUserIdFromSession(sessionid.Value)
	if err != nil {
		// json respose to be implemented
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	var req CreatePostRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	// Start database transaction
	tx, err := h.Users.DB.Begin()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback() // Rollback transaction if something goes wrong

	content := &models.Content{
		ID:          utils.UUIDGen(),
		AuthorID:    user_id,
		ContentType: "post",
		Title:       req.Title,
		Text:        req.Text,
	}

	err = h.Users.InsertContent(tx, content)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return

	}
	// Commit transaction
	if err := tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	// Prepare response
	response := CreatePostResponse{
		PostID:  content.ID,
		Message: "Post created successfully",
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
