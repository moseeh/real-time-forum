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
	CommentsCount int    `json:"comments_count"`
	ContentID     string `json:"content_id"`
}

func (h *Handler) HandleComments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user_id, ok := r.Context().Value(UserIDKey).(string)
	if !ok {
		ServerErrorHandler(w,r)
		return
	}

	var comment Comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		BadRequestHandler(w,r)
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
		ServerErrorHandler(w,r)
		return
	}
	defer tx.Rollback()

	err = h.Users.InsertContent(tx, &content)
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}
	var response CommentResponse

	comment_count, err := h.Users.GetContentCommentCount(tx, comment.ContentID)
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}
	if err = tx.Commit(); err != nil {
		ServerErrorHandler(w,r)
		return
	}
	response.CommentsCount = comment_count
	response.ContentID = comment.ContentID
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

	message := Message{
		Type:     "comment",
		SenderID: user_id,
		Post:     response,
	}
	for userid, conn := range users {
		if userid != user_id {
			conn.WriteJSON(message)
		}
	}
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
