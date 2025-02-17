package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type PostDetailsResponse struct {
	Post    interface{} `json:"post"`
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
}

type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		Success: false,
		Message: message,
	})
}

func (h *Handler) HandlePostDetails(w http.ResponseWriter, r *http.Request) {
	// Only allow GET method
	if r.Method != http.MethodGet {
		writeJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check for session cookie
	sessionID, err := r.Cookie("session_id")
	if err != nil {
		writeJSONError(w, "Unauthorized - no valid session", http.StatusUnauthorized)
		return
	}

	// Get user ID from session
	userID, err := h.Users.GetUserIdFromSession(sessionID.Value)
	if err != nil {
		writeJSONError(w, "Invalid session", http.StatusUnauthorized)
		return
	}

	// Get post ID from query parameters
	postID := r.URL.Query().Get("postID")
	if postID == "" {
		writeJSONError(w, "Missing postID parameter", http.StatusBadRequest)
		return
	}

	// Get post details
	post, err := h.Users.GetPost(postID, userID)
	if err != nil {
		writeJSONError(w, fmt.Sprintf("Error retrieving post: %v", err), http.StatusInternalServerError)
		return
	}

	// Check if post exists
	if post == nil {
		writeJSONError(w, "Post not found", http.StatusNotFound)
		return
	}

	// Prepare successful response
	response := PostDetailsResponse{
		Success: true,
		Post:    post,
	}

	// Write response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		writeJSONError(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}
