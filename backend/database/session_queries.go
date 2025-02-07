package database

import (
	"fmt"
	"time"
)

func (m *UserModel) CreateSession(session_id, user_id string) error {
	tx, err := m.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback()

	const DELETE_EXISTING = `DELETE FROM SESSIONS WHERE user_id = ?`
	_, err = tx.Exec(DELETE_EXISTING, user_id)
	if err != nil {
		return fmt.Errorf("failed to delete existing sessions: %v", err)
	}

	const CREATE_SESSION = `INSERT INTO SESSIONS (session_id, expires_at, user_id) VALUES (?,?,?)`
	expiresAt := time.Now().Add(2 * time.Hour).String()
	_, err = tx.Exec(CREATE_SESSION, session_id, expiresAt, user_id)
	if err != nil {
		return fmt.Errorf("failed to insert new session: %v", err)
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %v", err)
	}
	return nil
}

func (m *UserModel) DeleteSession(session_id string) error {
	query := `DELETE FROM SESSIONS WHERE session_id = ?;`
	_, err := m.DB.Exec(query, session_id)
	return err
}
