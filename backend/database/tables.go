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
	title TEXT,
	text TEXT NOT NULL,
	image_url TEXT,
	likes_count INTEGER DEFAULT 0,
	dislikes_count INTEGER DEFAULT 0, 
	comments_count INTEGER DEFAULT 0,
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

const CATEGORIES_TABLE string = `CREATE TABLE IF NOT EXISTS CATEGORIES (
    category_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

const POST_CATEGORIES_TABLE = `CREATE TABLE IF NOT EXISTS POST_CATEGORIES (
    post_id VARCHAR(255) NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES POSTS (post_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES CATEGORIES (category_id) ON DELETE CASCADE
);`

const MESSAGE_TABLE = `CREATE TABLE IF NOT EXISTS MESSAGES (
	message_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
	senderId TEXT NOT NULL,
	receiverId TEXT NOT NULL,
	message TEXT NOT NULL,
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (senderId) REFERENCES USERS(user_id),
	FOREIGN KEY (receiverId) REFERENCES USERS(user_id)
);`

var Tables = []string{
	USERS_TABLE,
	SESSIONS_TABLE,
	CONTENTS_TABLE,
	USER_INTERACTIONS_TABLE,
	CATEGORIES_TABLE,
	POST_CATEGORIES_TABLE,
	MESSAGE_TABLE,
}

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
