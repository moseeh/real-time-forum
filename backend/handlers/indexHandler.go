package handlers

import (
	"net/http"

	"real-time-forum/backend/database"
)

type Handler struct {
	Users *database.UserModel
}

func NewHandler(users *database.UserModel) *Handler {
	return &Handler{Users: users}
}

func (h *Handler) ServeIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./static/index.html")
}
