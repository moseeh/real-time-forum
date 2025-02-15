package database

import (
	"database/sql"
	"errors"
	"fmt"

	"real-time-forum/backend/models"
)

var ErrNoRecord = errors.New("no matching record found")

type User struct {
	UserId   string `json:"id"`
	Username string `json:"name"`
	Online   bool   `json:"online"`
}

func (m *UserModel) InsertUser(id, first_name, last_name, username, email, gender, password string, age int) error {
	const USER_INSERT string = "INSERT INTO USERS (user_id, first_name, last_name,  username, email, gender, age, password) VALUES (?,?,?,?,?,?,?,?);"
	stmt, err := m.DB.Prepare(USER_INSERT)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(id, first_name, last_name, username, email, gender, age, password)
	if err != nil {
		return err
	}

	return nil
}

func (m *UserModel) UserExists(email, username string) (bool, error) {
	const USER_EXISTS string = `SELECT COUNT(1) FROM USERS WHERE email = ? OR username = ?;`

	stmt, err := m.DB.Prepare(USER_EXISTS)
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	var count int
	err = stmt.QueryRow(email, username).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (m *UserModel) GetUserByEmailOrUsername(identifier string) (*models.User, error) {
	const GET_USER string = `SELECT user_id, first_name, last_name, username, email, gender, age, password 
	     FROM USERS where email = ? OR username = ?;`

	stmt, err := m.DB.Prepare(GET_USER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	user := &models.User{}

	err = stmt.QueryRow(identifier, identifier).Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Username,
		&user.Email,
		&user.Gender,
		&user.Age,
		&user.PasswordHash,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNoRecord
		}
		return nil, err
	}
	return user, nil
}

func (u *UserModel) GetAllUsers(userid string) ([]User, error) {
	// Query to fetch all users except the main user
	query := `
        SELECT 
            USERS.user_id,
            USERS.username,
            MAX(MESSAGES.timestamp) AS last_interaction
        FROM 
            USERS
        LEFT JOIN 
            MESSAGES ON (USERS.user_id = MESSAGES.senderId OR USERS.user_id = MESSAGES.receiverId)
            AND (MESSAGES.senderId = ? OR MESSAGES.receiverId = ?)
        WHERE 
            USERS.user_id != ?
        GROUP BY 
            USERS.user_id
        ORDER BY 
            last_interaction DESC NULLS LAST, 
    		USERS.username ASC;
    `

	rows, err := u.DB.Query(query, userid, userid, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var one User
		var lastInteraction sql.NullString // Use sql.NullString to handle NULL values
		err := rows.Scan(&one.UserId, &one.Username, &lastInteraction)
		if err != nil {
			return nil, err
		}
		users = append(users, one)
	}

	return users, nil
}
