package handlers

import (
	"encoding/json"
	"net/http"
)

func (h *Handler) GetCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	categories, err := h.Users.GetAllCategories()
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
		Message: "Fetched categories Successfully",
		Data:    categories,
	})
}
