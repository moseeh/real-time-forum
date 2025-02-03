package database

import "fmt"

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
