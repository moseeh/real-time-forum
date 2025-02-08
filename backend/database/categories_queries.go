package database

import (
	"database/sql"
	"log"

	"github.com/gofrs/uuid"
)

type Category struct {
	CategoryID  string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

var categories = []Category{
	{Name: "Technology", Description: "All about the latest tech trends and innovations"},
	{Name: "Sports", Description: "Updates and news about various sports"},
	{Name: "Music", Description: "Genres, artists, and music events"},
	{Name: "Food", Description: "Delicious recipes and culinary delights"},
	{Name: "Science", Description: "Discoveries and research in science"},
	{Name: "AI", Description: "Artificial Intelligence advancements and discussions"},
	{Name: "Travel", Description: "Travel guides and destinations"},
	{Name: "Health", Description: "Health tips and medical advice"},
	{Name: "Finance", Description: "Financial advice and economic news"},
	{Name: "Entertainment", Description: "Movies series and anime"},
	{Name: "Memes", Description: "Funny memes on any topics"},
	{Name: "Programming Tips", Description: "Help each other solve things"},
}

// Function to insert categories into the database
func InsertCategories(db *sql.DB) {
	stmt, err := db.Prepare(`INSERT OR IGNORE INTO CATEGORIES (category_id, name, description) VALUES (?, ?, ?)`)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	for _, category := range categories {
		id, err := uuid.NewV4()
		if err != nil {
			log.Fatal("Error generating UUID:", err)
		}

		_, err = stmt.Exec(id.String(), category.Name, category.Description)
		if err != nil {
			log.Printf("Error inserting category %s: %v\n", category.Name, err)
		}
	}
}

// GetAllCategories retrieves all available categories
func (u *UserModel) GetAllCategories() ([]Category, error) {
	query := `SELECT category_id, name, description FROM CATEGORIES`
	rows, err := u.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var cat Category
		err := rows.Scan(&cat.CategoryID, &cat.Name, &cat.Description)
		if err != nil {
			return nil, err
		}
		categories = append(categories, cat)
	}
	return categories, nil
}
