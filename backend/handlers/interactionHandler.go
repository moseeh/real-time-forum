package handlers

import (
	"encoding/json"
	"net/http"

	"real-time-forum/backend/models"
	"real-time-forum/backend/utils"
)

type InteractionRequest struct {
	ContentID       string `json:"content_id"`
	InteractionType string `json:"interaction_type"`
}

type InteractionResponse struct {
	ContentID     string `json:"content_id"`
	LikesCount    int    `json:"likes_count"`
	DislikesCount int    `json:"dislikes_count"`
	IsLiked       bool   `json:"is_liked"`
	IsDisliked    bool   `json:"is_disliked"`
}

func (h *Handler) HandleInteraction(w http.ResponseWriter, r *http.Request) {
	user_id, ok := r.Context().Value(UserIDKey).(string)
	if !ok {
		ServerErrorHandler(w,r)
		return
	}
	var req InteractionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		BadRequestHandler(w,r)
		return
	}

	interaction := &models.UserInteraction{
		InteractionID:   utils.UUIDGen(),
		UserID:          user_id,
		ContentID:       req.ContentID,
		InteractionType: req.InteractionType,
	}
	if err := h.Users.AddUserInteraction(interaction); err != nil {
		ServerErrorHandler(w,r)
		return
	}
	post, err := h.Users.GetPost(req.ContentID, user_id)
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}
	response := InteractionResponse{
		ContentID:     req.ContentID,
		LikesCount:    post.LikesCount,
		DislikesCount: post.DislikesCount,
		IsLiked:       post.IsLiked,
		IsDisliked:    post.IsDisliked,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

	message := Message{
		Type:       "interaction",
		SenderID:   user_id,
		Post:       response,
	}

	for userid, conn := range users {
		if userid != user_id{
			conn.WriteJSON(message)
		}
	}
}
