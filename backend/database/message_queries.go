package database

import (
	"database/sql"
	"real-time-forum/backend/models"
)

func (m *UserModel) SaveMessage(tx *sql.Tx, messageID, senderID, receiverID, message string) error {
	query := `INSERT INTO messages (message_id, senderId, receiverId, message) VALUES (?, ?, ?, ?)`
	_, err := tx.Exec(query, messageID, senderID, receiverID, message)
	return err
}

// GetAllMessages retrieves messages between senderId and receiverId (including switched roles)
func (u *UserModel) GetAllMessages(senderId, receiverId string) ([]models.Message, error) {
	// SQL query to fetch messages
	query := `
        SELECT 
            MESSAGES.message, 
            USERS.username AS sender_username, 
            MESSAGES.timestamp
        FROM 
            MESSAGES
        JOIN 
            USERS ON MESSAGES.senderId = USERS.user_id
        WHERE 
            (MESSAGES.senderId = ? AND MESSAGES.receiverId = ?)
            OR 
            (MESSAGES.senderId = ? AND MESSAGES.receiverId = ?)
        ORDER BY 
            MESSAGES.timestamp ASC;` // DESC to get the most recent messages first

	// Execute the query
	rows, err := u.DB.Query(query, senderId, receiverId, receiverId, senderId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Slice to store the messages
	var messages []models.Message

	// Iterate through the rows
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(&msg.Message, &msg.SenderUsername, &msg.Timestamp)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	// Check for errors after iteration
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return messages, nil
}
