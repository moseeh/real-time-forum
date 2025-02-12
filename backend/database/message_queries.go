package database

import "database/sql"

func (m *UserModel) SaveMessage(tx *sql.Tx, messageID, senderID, receiverID, message string) error {
	query := `INSERT INTO messages (message_id, senderId, receiverId, message) VALUES (?, ?, ?, ?)`
	_, err := tx.Exec(query, messageID, senderID, receiverID, message)
	return err
}
