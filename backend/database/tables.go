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
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    gender VARCHAR(10) NOT NULL,
    age INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

const SESSIONS_TABLE string = `
    CREATE TABLE IF NOT EXISTS SESSIONS(
        session_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        user_id VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES USERS(user_id)
    );
`

const CONTENTS_TABLE string = ` CREATE TABLE IF NOT EXISTS CONTENTS (
	content_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
	user_id VARCHAR(255) NOT NULL,
	parent_id VARCHAR(255),
	content_type VARCHAR(10) NOT NULL CHECK (content_type IN ('post', 'comment', 'subcomment')),
	text TEXT NOT NULL,
	likes_count INTEGER DEFAULT 0,
	dislikes_count INTEGER DEFAULT 0, 
	comment_count INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES USERS(user_id),
	FOREIGN KEY (parent_id) REFERENCES CONTENTS(content_id) 
);
`

const USER_INTERACTIONS_TABLE string = `CREATE TABLE IF NOT EXISTS USER_INTERACTIONS(
	interaction_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
	user_id VARCHAR(255) NOT NULL,
	content_id VARCHAR(255) NOT NULL,
	interaction_type VARCHAR(10) NOT NULL CHECK (interaction_type IN ('like', 'dislike')),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES USERS(user_id),
	FOREIGN KEY (content_id) REFERENCES CONTENTS(content_id),
	UNIQUE(user_id, content_id, interaction_type)
);`

var Tables = []string{USERS_TABLE, SESSIONS_TABLE, CONTENTS_TABLE, USER_INTERACTIONS_TABLE}

func (m *UserModel) InitTables() {
	for _, statement := range Tables {
		if err := m.executeStatement(statement); err != nil {
			log.Printf("Error creating table: %v%v", err, statement)
		}
	}
	m.InitTriggers()
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
