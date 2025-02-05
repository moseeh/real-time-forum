package database

import (
	"database/sql"
	"errors"
	"fmt"

	"real-time-forum/backend/models"
)

var ErrNoRecord = errors.New("no matching record found")

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
