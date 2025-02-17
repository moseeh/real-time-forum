package database

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"real-time-forum/backend/models"
)

var ErrNoRecord = errors.New("no matching record found")

type User struct {
	UserId   string `json:"id"`
	Username string `json:"name"`
	Online   bool   `json:"online"`
	Lasttime string `json:"lasttime"`
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
	fmt.Println(userid)
	query := `
       WITH last_messages AS (
			SELECT
        		u.user_id AS id,
        		u.username,
        		COALESCE(
            		(SELECT strftime('%Y-%m-%dT%H:%M:%SZ', MAX(m.timestamp))
             		FROM MESSAGES m
             		WHERE (m.senderId = u.user_id AND m.receiverId = ?)
                		OR (m.senderId = ? AND m.receiverId = u.user_id)
            		), 
            		''
        		) AS sort_time
    		FROM 
       			USERS u
    		WHERE 
        		u.user_id != ?
		)
		SELECT 
    		id AS user_id,
    		username,
    		sort_time
		FROM 
    		last_messages
		ORDER BY 
    		CASE WHEN sort_time = '' THEN 1 ELSE 0 END,
    		sort_time DESC,
    		username ASC;
    `

	rows, err := u.DB.Query(query, userid, userid, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var one User
		var lastInteraction sql.NullString

		err := rows.Scan(&one.UserId, &one.Username, &lastInteraction)
		if err != nil {
			return nil, err
		}

		if lastInteraction.Valid {
			// Parse the timestamp and format it
			if t, err := time.Parse("2006-01-02 15:04:05", lastInteraction.String); err == nil {
				one.Lasttime = t.Format(time.RFC3339) // Convert to ISO8601 format
			} else {
				one.Lasttime = "" // If parsing fails, set empty string
			}
		} else {
			one.Lasttime = "" // Set empty string if no interaction
		}

		users = append(users, one)
	}

	return users, nil
}
