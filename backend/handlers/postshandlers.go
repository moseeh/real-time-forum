package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"real-time-forum/backend/models"
	"real-time-forum/backend/utils"
)

type CreatePostResponse struct {
	Post    interface{} `json:"post"`
	Message string      `json:"message"`
}

func (h *Handler) CreatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user_id, ok := r.Context().Value(UserIDKey).(string)
	if !ok {
		fmt.Println("her1")
		SendJSONError(w, http.StatusInternalServerError, "User ID not found in context")
		return
	}
	// r.Body = http.MaxBytesReader(w, r.Body, 25<<20)
	if err := r.ParseMultipartForm(20 << 20); err != nil {
		fmt.Println("her2")
		http.Error(w, "Error parsing form data: "+err.Error(), http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	content := r.FormValue("content")
	categories := r.Form["categories[]"]

	if title == "" || content == "" {
		fmt.Println("her3")
		http.Error(w, "Title and content are required", http.StatusBadRequest)
		return
	}
	postID := utils.UUIDGen()
	var imagePath string
	file, fileHeader, err := r.FormFile("image")
	if err != nil && err != http.ErrMissingFile {
		fmt.Println("her4")
		http.Error(w, "Error retrieving the file: "+err.Error(), http.StatusBadRequest)
		return

	}

	if file != nil {
		defer file.Close()

		postDir := "static/images"

		// add file extension
		ext := filepath.Ext(fileHeader.Filename)
		newFilename := postID + ext

		// difine file path
		filepath := filepath.Join(postDir, newFilename)

		// Create the directory if it doesn't exist
		if _, err := os.Stat(postDir); os.IsNotExist(err) {
			os.Mkdir(postDir, os.ModePerm)
		}

		// create the file
		out, err := os.Create(filepath)
		if err != nil {
			fmt.Println("her5")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer out.Close()
		if _, err := io.Copy(out, file); err != nil {
			fmt.Println("her6")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		imagePath = newFilename
	}

	post := &models.Content{
		ID:          postID,
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
		fmt.Println("her5")
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
	responsePost, err := h.Users.GetPost(post.ID, post.AuthorID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Prepare response
	response := CreatePostResponse{
		Post:    responsePost,
		Message: "Post created successfully",
	}
	// Send response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
