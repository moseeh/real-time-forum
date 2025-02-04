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

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}
	user, err := h.Users.GetUserByEmailOrUsername(req.Username)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Invalid credentials",
		})
		return
	}
	if !utils.CompareHash(user.PasswordHash, req.Password) {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Invalid credentials",
		})
		return
	}

	sessionID := utils.TokenGen(10)

	err = h.Users.CreateSession(sessionID, user.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Error creating session",
		})
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
			"username":  req.Username,
			"email":     user.Email,
			"userID":    user.ID,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"gender":    user.Gender,
			"age":       user.Age,
		},
	})
}
