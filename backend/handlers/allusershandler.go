package handlers

import (
	"encoding/json"
	"net/http"
)

type User struct {
	ID string `json:"iusername"`
}

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}
	users, err := h.Users.GetAllUsers(user.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Server error occurred",
		})
		return
	}
	json.NewEncoder(w).Encode(ApiResponse{
		Success: true,
		Message: "Fetched users Successfully",
		Data:    users,
	})
}
