package database

import (
	"database/sql"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

// setupTestDB initializes an in-memory SQLite database for testing.
func setupTestDB(t *testing.T) *sql.DB {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("Failed to open test database: %v", err)
	}

	// Create Categories table
	createTableSQL := `
	CREATE TABLE CATEGORIES (
		category_id TEXT PRIMARY KEY,
		name TEXT UNIQUE NOT NULL,
		description TEXT
	);
	CREATE TABLE POST_CATEGORIES (
		post_id TEXT,
		category_id TEXT,
		PRIMARY KEY (post_id, category_id)
	);
	`
	_, err = db.Exec(createTableSQL)
	if err != nil {
		t.Fatalf("Failed to create tables: %v", err)
	}

	return db
}

// TestInsertCategories checks if categories are inserted successfully.
func TestInsertCategories(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	InsertCategories(db)

	// Verify categories were inserted
	rows, err := db.Query("SELECT category_id, name, description FROM CATEGORIES")
	if err != nil {
		t.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()

	var count int
	for rows.Next() {
		count++
	}
	if count != len(categories) {
		t.Errorf("Expected %d categories, got %d", len(categories), count)
	}
}

// TestGetAllCategories ensures that retrieving categories works correctly.
func TestGetAllCategories(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	InsertCategories(db)
	userModel := &UserModel{DB: db}

	cats, err := userModel.GetAllCategories()
	if err != nil {
		t.Fatalf("GetAllCategories() failed: %v", err)
	}

	if len(cats) != len(categories) {
		t.Errorf("Expected %d categories, got %d", len(categories), len(cats))
	}
}

func TestGetPostCategories(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	categoryID := "test-category-id"
	_, err := db.Exec(`INSERT INTO CATEGORIES (category_id, name, description) VALUES (?, ?, ?)`, categoryID, "Technology", "Tech-related topics")
	if err != nil {
		t.Fatalf("Failed to insert mock category: %v", err)
	}

	postID := "post1"
	_, err = db.Exec(`INSERT INTO POST_CATEGORIES (post_id, category_id) VALUES (?, ?)`, postID, categoryID)
	if err != nil {
		t.Fatalf("Failed to insert post-category relationship: %v", err)
	}

	userModel := &UserModel{DB: db}

	cats, err := userModel.GetPostCategories(postID)
	if err != nil {
		t.Fatalf("GetPostCategories() failed: %v", err)
	}

	if len(cats) != 1 || cats[0].CategoryID != categoryID || cats[0].Name != "Technology" {
		t.Errorf("Expected 1 category with ID %s and Name 'Technology', got %v", categoryID, cats)
	}
}
