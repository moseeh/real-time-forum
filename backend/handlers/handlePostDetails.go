package handlers

import (
	"encoding/json"
	"net/http"
)

type PostDetailsResponse struct {
	Post    interface{} `json:"post"`
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
}

type ErrorResponse struct {
	Status  string `json:"status"`
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// func writeJSONError(w http.ResponseWriter, message string, statusCode int) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(statusCode)
// 	json.NewEncoder(w).Encode(ErrorResponse{
// 		Success: false,
// 		Message: message,
// 	})
// }

func (h *Handler) HandlePostDetails(w http.ResponseWriter, r *http.Request) {
	// Check for session cookie
	userID, ok := r.Context().Value(UserIDKey).(string)
	if !ok {
		ServerErrorHandler(w, r)
		return
	}

	// Get post ID from query parameters
	postID := r.URL.Query().Get("postID")
	if postID == "" {
		BadRequestHandler(w, r)
		return
	}

	// Get post details
	post, err := h.Users.GetPost(postID, userID)
	if err != nil {
		ServerErrorHandler(w, r)
		return
	}

	// Check if post exists
	if post == nil {
		NotFoundHandler(w, r)
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
		ServerErrorHandler(w, r)
		return
	}
}
