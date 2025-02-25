package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"real-time-forum/backend/utils"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ApiResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type contextKey string

const (
	UserIDKey contextKey = "userID"
)

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		BadRequestHandler(w,r)
		return
	}
	user, err := h.Users.GetUserByEmailOrUsername(req.Username)
	if err != nil {
		NotAuthorized(w,r)
		return
	}
	if !utils.CompareHash(user.PasswordHash, req.Password) {
		NotAuthorized(w,r)
		return
	}

	sessionID := utils.TokenGen(10)

	err = h.Users.CreateSession(sessionID, user.ID)
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionID,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   7200,
		Expires:  time.Now().Add(2 * time.Hour),
	})
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(ApiResponse{
		Success: true,
		Message: "Login Successful",
		Data: map[string]any{
			"username":  user.Username,
			"email":     user.Email,
			"userID":    user.ID,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"gender":    user.Gender,
			"age":       user.Age,
		},
	})
}
