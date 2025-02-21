package handlers

import (
	"encoding/json"
	"net/http"

	"real-time-forum/backend/database"
)

type PostResponse struct {
	Posts []database.Post `json:"posts"`
	Error string          `json:"error,omitempty"`
}

func (h *Handler) GetPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user_id, ok := r.Context().Value(UserIDKey).(string)
	if !ok {
		SendJSONError(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}
	posts, err := h.Users.GetAllPosts(user_id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(PostResponse{
			Error: "Failed to fetch posts",
		})
		return
	}
	// Return successful response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(PostResponse{
		Posts: posts,
	})
}
