package database

import "database/sql"

func (m *UserModel) SaveMessage(tx *sql.Tx, senderID, receiverID, message string) error {
	query := `INSERT INTO messages (senderId, receiverId, message) VALUES (?, ?, ?)`
	_, err := tx.Exec(query, senderID, receiverID, message )
	return err
}
