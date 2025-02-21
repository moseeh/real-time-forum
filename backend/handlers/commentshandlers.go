package handlers

import (
	"encoding/json"
	"net/http"

	"real-time-forum/backend/models"
	"real-time-forum/backend/utils"
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
	user_id, ok := r.Context().Value(UserIDKey).(string)
	if !ok {
		SendJSONError(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}

	var comment Comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	content := models.Content{
		ID:          utils.UUIDGen(),
		ParentID:    comment.ContentID,
		Text:        comment.Comment,
		AuthorID:    user_id,
		ContentType: "comment",
	}
	tx, err := h.Users.DB.Begin()
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	err = h.Users.InsertContent(tx, &content)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	var response CommentResponse

	comment_count, err := h.Users.GetContentCommentCount(tx, comment.ContentID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	if err = tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}
	response.CommentsCount = comment_count
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// SendJSONError sends a JSON error response
func SendJSONError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{
		Status:  "error",
		Message: message,
	})
}
