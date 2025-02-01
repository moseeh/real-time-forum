package database

import (
	"database/sql"
	"log"
)

type UserModel struct {
	DB *sql.DB
}

const USERS_TABLE string = `CREATE TABLE IF NOT EXISTS USERS (
    user_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    second_name VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    gender VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    auth_provider VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

var Tables = []string{USERS_TABLE}

func (m *UserModel) InitTables() {
	for _, statement := range Tables {
		if err := m.executeStatement(statement); err != nil {
			log.Printf("Error creating table: %v", err)
		}
	}
}

func (m *UserModel) executeStatement(statement string) error {
	stmt, err := m.DB.Prepare(statement)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec()
	return err
}
