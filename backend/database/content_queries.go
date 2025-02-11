package database

import (
	"database/sql"
	"time"

	"real-time-forum/backend/models"
)

type Post struct {
	ContentID     string
	UserID        string
	Username      string
	Text          string
	Title         string
	CreatedAt     time.Time
	Categories    []Category
	LikesCount    int
	CommentsCount int
	DislikesCount int
	Isliked       bool
	IsDisliked    bool
}

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

func (u *UserModel) GetAllPosts(currentUserID string) ([]Post, error) {
	query := `
		SELECT 
			c.content_id,
			c.title, 
			c.text, 
			c.created_at,
			u.username,
			c.user_id,
			c.likes_count,
			c.dislikes_count,
			c.comments_count, 
			CASE 
                WHEN ui_like.interaction_id IS NOT NULL THEN 1
                ELSE 0
            END as is_liked,       -- maps to IsLiked
            CASE 
                WHEN ui_dislike.interaction_id IS NOT NULL THEN 1
                ELSE 0
            END as is_disliked     -- maps to IsDisliked
        FROM CONTENTS c
        JOIN USERS u ON c.user_id = u.user_id
        LEFT JOIN USER_INTERACTIONS ui_like ON 
            c.content_id = ui_like.content_id 
            AND ui_like.user_id = ? 
            AND ui_like.interaction_type = 'like'
        LEFT JOIN USER_INTERACTIONS ui_dislike ON 
            c.content_id = ui_dislike.content_id 
            AND ui_dislike.user_id = ? 
            AND ui_dislike.interaction_type = 'dislike'
        WHERE c.content_type = 'post'
        ORDER BY c.created_at DESC
	`
	rows, err := u.DB.Query(query, currentUserID, currentUserID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []Post

	for rows.Next() {
		var post Post
		var isLiked, isDisliked int
		err := rows.Scan(
			&post.ContentID,
			&post.Title,
			&post.Text,
			&post.CreatedAt,
			&post.Username,
			&post.UserID,
			&post.LikesCount,
			&post.DislikesCount,
			&post.CommentsCount,
			&isLiked,
			&isDisliked,
		)
		if err != nil {
			return nil, err
		}

		// Convert int to bool for is_liked and is_disliked
		post.Isliked = isLiked == 1
		post.IsDisliked = isDisliked == 1

		// Get categories for this post
		categories, err := u.GetPostCategories(post.ContentID)
		if err != nil {
			return nil, err
		}
		post.Categories = categories
		posts = append(posts, post)
	}
	return posts, nil
}
