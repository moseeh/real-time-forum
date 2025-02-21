package database

import (
	"database/sql"
	"fmt"
)

func (u *UserModel) GetPostComments(postID string) ([]CommentThread, error) {
	query := `
        WITH RECURSIVE CommentHierarchy(
            content_id,
            parent_id,
            user_id,
            username,
            text,
            created_at,
            updated_at,
            likes_count,
            dislikes_count,
            comments_count,
            level,
            path
        ) AS (
            -- Base case: get top-level comments
            SELECT 
                c.content_id,
                c.parent_id,
                c.user_id,
                u.username,
                c.text,
                c.created_at,
                c.updated_at,
                c.likes_count,
                c.dislikes_count,
                c.comments_count,
                1,
                c.content_id as path
            FROM CONTENTS c
            JOIN USERS u ON c.user_id = u.user_id
            WHERE c.parent_id = ?
            AND c.content_type = 'comment'
            
            UNION ALL
            
            -- Recursive case: get replies
            SELECT 
                c.content_id,
                c.parent_id,
                c.user_id,
                u.username,
                c.text,
                c.created_at,
                c.updated_at,
                c.likes_count,
                c.dislikes_count,
                c.comments_count,
                ch.level + 1,
                ch.path || '/' || c.content_id
            FROM CONTENTS c
            JOIN CommentHierarchy ch ON c.parent_id = ch.content_id
            JOIN USERS u ON c.user_id = u.user_id
            WHERE c.content_type = 'comment'
        )
        SELECT * FROM CommentHierarchy
        ORDER BY path, level, created_at;`

	rows, err := u.DB.Query(query, postID)
	if err != nil {
		return nil, fmt.Errorf("error querying comments: %v", err)
	}
	defer rows.Close()

	// Map to store all comments by their ID
	commentMap := make(map[string]*CommentThread)

	// Slice to store top-level comments
	var topLevelComments []CommentThread

	// Scan all comments
	for rows.Next() {
		var comment CommentThread
		var level int
		var path string
		var commentsCount int

		err := rows.Scan(
			&comment.ContentID,
			&comment.ParentID,
			&comment.UserID,
			&comment.Username,
			&comment.Text,
			&comment.CreatedAt,
			&comment.UpdatedAt,
			&comment.LikesCount,
			&comment.DislikesCount,
			&commentsCount,
			&level,
			&path,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning comment row: %v", err)
		}

		// Initialize empty replies slice
		comment.Replies = []CommentThread{}
		comment.CommentsCount = commentsCount // Add this line

		// Store pointer to comment in map
		commentMap[comment.ContentID] = &comment

		if comment.ParentID == postID {
			// This is a top-level comment
			topLevelComments = append(topLevelComments, comment)
		} else {
			// This is a reply - add it to its parent's replies
			if parent, exists := commentMap[comment.ParentID]; exists {
				parent.Replies = append(parent.Replies, comment)
			}
		}
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating comment rows: %v", err)
	}

	return topLevelComments, nil
}

func (u *UserModel) GetContentCommentCount(tx *sql.Tx, contentID string) (int, error) {
	var count int
	err := tx.QueryRow(`SELECT COUNT(*) FROM CONTENTS WHERE parent_id = ?`, contentID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
