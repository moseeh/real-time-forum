package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Comment struct {
	ContentID string `json:"content_id"`
	Comment   string `json:"comment"`
}
type CommentResponse struct {
	CommentsCount int `json:"comments_count"`
}

func (h *Handler) HandleComments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	sessionid, err := r.Cookie("session_id")
	if err != nil {
		// json respose to be implemented
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	user_id, err := h.Users.GetUserIdFromSession(sessionid.Value)
	if err != nil {
		// json respose to be implemented
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var comment Comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	fmt.Println(comment, user_id)
}
