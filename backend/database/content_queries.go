package database

import (
	"database/sql"

	"real-time-forum/backend/models"
)

func (m *UserModel) InsertContent(tx *sql.Tx, content *models.Content) error {
	query := `INSERT INTO CONTENTS (content_id, user_id, parent_id, content_type, title, text) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := tx.Exec(query, content.ID, content.AuthorID, content.ParentID, content.ContentType, content.Title, content.Text)
	return err
}

// InsertPostCategory links a post to a category
func (u *UserModel) InsertPostCategory(tx *sql.Tx, postID, categoryID string) error {
	query := `INSERT INTO POST_CATEGORIES (post_id, category_id) VALUES (?, ?)`
	_, err := tx.Exec(query, postID, categoryID)
	return err
}
