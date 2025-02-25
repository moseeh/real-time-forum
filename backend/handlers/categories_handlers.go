package handlers

import (
	"encoding/json"
	"net/http"
)

func (h *Handler) GetCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	categories, err := h.Users.GetAllCategories()
	if err != nil {
		ServerErrorHandler(w,r)
		return
	}
	json.NewEncoder(w).Encode(ApiResponse{
		Success: true,
		Message: "Fetched categories Successfully",
		Data:    categories,
	})
}
