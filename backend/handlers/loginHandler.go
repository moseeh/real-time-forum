package handlers

import (
	"encoding/json"
	"net/http"
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
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}
	if req.Username == "" || req.Password == "" {
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Username and Passoword are required",
		})
		return
	}

	json.NewEncoder(w).Encode(ApiResponse{
		Success: true,
		Message: "Login Successful",
		Data: map[string]string{
			"username": req.Username,
		},
	})
}
