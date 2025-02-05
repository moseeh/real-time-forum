package main

import (
	"database/sql"
	"log"
	"net/http"

	"real-time-forum/backend/database"
	"real-time-forum/backend/handlers"
	"real-time-forum/backend/middleware"

	_ "github.com/mattn/go-sqlite3"
)

type App struct {
	Users *database.UserModel
}

func main() {
	db, err := sql.Open("sqlite3", "./forum.db")
	if err != nil {
		log.Println(err)
		return
	}

	app := App{
		Users: &database.UserModel{
			DB: db,
		},
	}
	app.Users.InitTables()

	h := handlers.NewHandler(app.Users)

	mwApp := &middleware.App{
		Users:    app.Users,
		Handlers: h,
	}
	router := mwApp.RouteChecker(mwApp.Routes())

	log.Println("Server started on http://localhost:8000")

	if err := http.ListenAndServe(":8000", router); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
