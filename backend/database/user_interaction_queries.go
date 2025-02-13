package database

import (
	"real-time-forum/backend/models"
)

func (m *UserModel) AddUserInteraction(interaction *models.UserInteraction) error {
	// First check if interaction exists
	checkQuery := `
		SELECT COUNT(*) 
		FROM USER_INTERACTIONS 
		WHERE user_id = ? 
		AND content_id = ? 
		AND interaction_type = ?`

	var count int
	err := m.DB.QueryRow(checkQuery, 
		interaction.UserID, 
		interaction.ContentID, 
		interaction.InteractionType).Scan(&count)
	if err != nil {
		return err
	}

	// If interaction exists, delete it
	if count > 0 {
		deleteQuery := `
			DELETE FROM USER_INTERACTIONS 
			WHERE user_id = ? 
			AND content_id = ? 
			AND interaction_type = ?`
		
		_, err = m.DB.Exec(deleteQuery, 
			interaction.UserID, 
			interaction.ContentID, 
			interaction.InteractionType)
		return err
	}

	// If interaction doesn't exist, insert it
	insertQuery := `
		INSERT INTO USER_INTERACTIONS 
		(interaction_id, user_id, content_id, interaction_type) 
		VALUES (?, ?, ?, ?)`
	
	_, err = m.DB.Exec(insertQuery,
		interaction.InteractionID,
		interaction.UserID,
		interaction.ContentID,
		interaction.InteractionType)
	
	return err
}