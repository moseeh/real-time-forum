package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"real-time-forum/backend/utils"
)

type SignupRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Gender    string `json:"gender"`
	Age       int    `json:"age"`
	Password  string `json:"password"`
}

func (h *Handler) SignupHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req SignupRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		BadRequestHandler(w,r)
		return
	}
	exists, err := h.Users.UserExists(req.Email, req.Username)
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}
	if exists {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "User with this email or username already exists",
		})
		return
	}
	userID := utils.UUIDGen()
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}

	err = h.Users.InsertUser(userID, req.FirstName, req.LastName, strings.ToLower(strings.TrimSpace(req.Username)), req.Email, req.Gender, hashedPassword, req.Age)
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ApiResponse{
		Success: true,
		Message: "User Created Successfully",
		Data: map[string]string{
			"username": req.Username,
			"userID":   userID,
		},
	})
}
