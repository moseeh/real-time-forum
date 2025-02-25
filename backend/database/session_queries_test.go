package database

import (
	"database/sql"
	"testing"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Set up an isolated test DB for session tests
func setupTestSessionDB(t *testing.T) (*sql.DB, func()) {
	db, err := sql.Open("sqlite3", ":memory:") // Each test gets a fresh DB instance
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	// Create SESSIONS table
	const SESSIONS_TABLE = `
    CREATE TABLE IF NOT EXISTS SESSIONS (
        session_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL
    );`
	_, err = db.Exec(SESSIONS_TABLE)
	if err != nil {
		t.Fatalf("failed to create sessions table: %v", err)
	}

	// Cleanup function to close DB
	cleanup := func() {
		db.Close()
	}

	return db, cleanup
}

// Test DeleteSession
func TestDeleteSession(t *testing.T) {
	db, cleanup := setupTestSessionDB(t)
	defer cleanup()

	userModel := UserModel{DB: db}

	// Insert a session
	_, err := db.Exec("INSERT INTO SESSIONS (session_id, user_id, expires_at) VALUES (?, ?, ?)", "session1", "user123", time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("failed to insert session: %v", err)
	}

	// Delete the session
	err = userModel.DeleteSession("session1")
	if err != nil {
		t.Errorf("DeleteSession failed: %v", err)
	}

	// Verify session was deleted
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM SESSIONS WHERE session_id = ?", "session1").Scan(&count)
	if err != nil {
		t.Fatalf("failed to check session existence: %v", err)
	}
	if count != 0 {
		t.Errorf("expected session to be deleted, but it still exists")
	}
}

// Test GetUserIdFromSession
func TestGetUserIdFromSession(t *testing.T) {
	db, cleanup := setupTestSessionDB(t)
	defer cleanup()

	userModel := UserModel{DB: db}

	// Insert a valid session
	_, err := db.Exec("INSERT INTO SESSIONS (session_id, user_id, expires_at) VALUES (?, ?, ?)", "session2", "user456", time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("failed to insert session: %v", err)
	}

	// Get user ID from session
	userID, err := userModel.GetUserIdFromSession("session2")
	if err != nil {
		t.Errorf("GetUserIdFromSession failed: %v", err)
	}
	if userID != "user456" {
		t.Errorf("expected userID 'user456', got '%s'", userID)
	}
}

// Test IsSessionValid
func TestIsSessionValid(t *testing.T) {
	db, cleanup := setupTestSessionDB(t)
	defer cleanup()

	userModel := UserModel{DB: db}

	// Insert a valid session
	_, err := db.Exec("INSERT INTO SESSIONS (session_id, user_id, expires_at) VALUES (?, ?, ?)", "valid_session", "user001", time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("failed to insert valid session: %v", err)
	}

	// Check session validity
	valid, err := userModel.IsSessionValid("valid_session")
	if err != nil {
		t.Errorf("IsSessionValid failed: %v", err)
	}
	if !valid {
		t.Errorf("expected session to be valid, but it was marked invalid")
	}

	// Insert an expired session
	_, err = db.Exec("INSERT INTO SESSIONS (session_id, user_id, expires_at) VALUES (?, ?, ?)", "expired_session", "user002", time.Now().Add(-time.Hour))
	if err != nil {
		t.Fatalf("failed to insert expired session: %v", err)
	}

}
