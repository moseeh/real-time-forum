package database

import (
	"database/sql"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

func setupUserTestDB(t *testing.T) (*sql.DB, func()) {
	db, err := sql.Open("sqlite3", ":memory:") // In-memory SQLite database
	if err != nil {
		t.Fatalf("failed to open test database: %v", err)
	}

	_, err = db.Exec(USERS_TABLE) // Create the USERS table
	if err != nil {
		t.Fatalf("failed to create users table: %v", err)
	}

	cleanup := func() {
		db.Close()
	}

	return db, cleanup
}

func TestInsertUser(t *testing.T) {
	db, cleanup := setupUserTestDB(t)
	defer cleanup()

	userModel := UserModel{DB: db}

	err := userModel.InsertUser("1111", "John", "Doe", "johndoe", "john@example.com", "Male", "securepass", 25)
	if err != nil {
		t.Errorf("InsertUser failed: %v", err)
	}

	// Verify user was inserted
	var count int
	err = db.QueryRow("SELECT COUNT(1) FROM USERS WHERE email = ?", "john@example.com").Scan(&count)
	if err != nil {
		t.Fatalf("failed to check user existence: %v", err)
	}
	if count != 1 {
		t.Errorf("expected 1 user in database, got %d", count)
	}
}

func TestUserExists(t *testing.T) {
	db, cleanup := setupUserTestDB(t)
	defer cleanup()

	userModel := UserModel{DB: db}

	// Insert a user first
	err := userModel.InsertUser("2222","Jane", "Doe", "janedoe", "jane@example.com", "Female", "securepass", 28)
	if err != nil {
		t.Fatalf("InsertUser failed: %v", err)
	}

	// Test existence check
	exists, err := userModel.UserExists("jane@example.com", "janedoe")
	if err != nil {
		t.Fatalf("UserExists query failed: %v", err)
	}
	if !exists {
		t.Errorf("expected user to exist, but UserExists returned false")
	}

	// Test non-existent user
	exists, err = userModel.UserExists("nonexistent@example.com", "noone")
	if err != nil {
		t.Fatalf("UserExists query failed: %v", err)
	}
	if exists {
		t.Errorf("expected user not to exist, but UserExists returned true")
	}
}
