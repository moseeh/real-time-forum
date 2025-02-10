package handlers

import (
	"encoding/json"
	"net/http"
)

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	users, err := h.Users.GetAllUsers()
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
