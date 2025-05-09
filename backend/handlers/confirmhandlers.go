package handlers

import (
	"encoding/json"
	"net/http"
)

type ConfirmNameRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
}

func (h *Handler) ConfirmName(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var data ConfirmNameRequest

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		BadRequestHandler(w,r)
		return
	}
	exists, err := h.Users.UserExists(data.Email, data.Username)
	if err != nil {
		NotAuthorized(w,r)
		return
	}
	if exists {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Username already exists",
		})
		return
	} else {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: true,
			Message: "Username does not exists",
		})
		return
	}
}
