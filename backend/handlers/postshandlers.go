package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"

	"real-time-forum/backend/models"
	"real-time-forum/backend/utils"
)

type CreatePostResponse struct {
	PostID  string `json:"post_id"`
	Message string `json:"message"`
}

func (h *Handler) CreatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	sessionid, err := r.Cookie("session_id")
	if err != nil {
		fmt.Println(1)
		// json respose to be implemented
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	user_id, err := h.Users.GetUserIdFromSession(sessionid.Value)
	if err != nil {
		// json respose to be implemented
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 25<<20)
	if err := r.ParseMultipartForm(20 << 20); err != nil {
		http.Error(w, "Error parsing form data: "+err.Error(), http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	content := r.FormValue("content")
	categories := r.Form["categories[]"]

	if title == "" || content == "" {
		http.Error(w, "Title and content are required", http.StatusBadRequest)
		return
	}
	var imagePath string
	file, fileHeader, err := r.FormFile("image")
	if err != nil {
		if !errors.Is(err, http.ErrMissingFile) {
			http.Error(w, "Error retrieving the file: "+err.Error(), http.StatusBadRequest)
			return
		}
	} else {
		defer file.Close()
		imagePath = "./uploads/" + fileHeader.Filename

		dst, err := os.Create(imagePath)
		if err != nil {
			http.Error(w, "Error saving file: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			http.Error(w, "Error saving file: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	post := &models.Content{
		ID:          utils.UUIDGen(),
		Title:       title,
		Text:        content,
		ImageUrl:    imagePath,
		ContentType: "post",
		ParentID:    "",
		AuthorID:    user_id,
	}
	// Start database transaction
	tx, err := h.Users.DB.Begin()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	err = h.Users.InsertContent(tx, post)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Insert categories
	for _, categoryID := range categories {
		err = h.Users.InsertPostCategory(tx, post.ID, categoryID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	if err := tx.Commit(); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}
	// Prepare response
	response := CreatePostResponse{
		PostID:  post.ID,
		Message: "Post created successfully",
	}
	// Send response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
