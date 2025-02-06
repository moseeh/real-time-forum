package database

import "real-time-forum/backend/models"

func (m *UserModel) AddUserInteraction(interaction *models.UserInteraction) error {
	query := `INSERT INTO USER_INTERACTIONS (interaction_id, user_id, content_id, interaction_type) VALUES (?, ?, ?, ?)`

	_, err := m.DB.Exec(query, interaction.InteractionID, interaction.UserID, interaction.ContentID, interaction.InteractionType)
	return err
}
