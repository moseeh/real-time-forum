package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

func (h *Handler) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("sleep moses")
	cookie, err := r.Cookie("session_id")
	if err == nil {
		err = h.Users.DeleteSession(cookie.Value)
		if err != nil {
			log.Printf("error deleting from session: %v", err)
		}
		http.SetCookie(w, &http.Cookie{
			Name:     "session_id",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			Expires:  time.Now().Add(-1 * time.Hour),
			MaxAge:   -1,
		})
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ApiResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}
