package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
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
	fmt.Println("moses")
	var req SignupRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Println(err)
		json.NewEncoder(w).Encode(ApiResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}

	json.NewEncoder(w).Encode(ApiResponse{
		Success: true,
		Message: "User Created Successfully",
		Data: map[string]string{
			"username": req.Username,
		},
	})
}
