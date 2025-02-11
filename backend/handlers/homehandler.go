package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"real-time-forum/backend/database"
)

type PostResponse struct {
	Posts []database.Post `json:"posts"`
	Error string          `json:"error,omitempty"`
}

func (h *Handler) GetPosts(w http.ResponseWriter, r *http.Request) {
	fmt.Println(1)
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
	fmt.Println(user_id)
	posts, err := h.Users.GetAllPosts(user_id)
	if err != nil {
		fmt.Println(err)

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
