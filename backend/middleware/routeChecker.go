package middleware

import (
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"real-time-forum/backend/database"
	"real-time-forum/backend/handlers"
)

type App struct {
	Users *database.UserModel
	Handlers *handlers.Handler
}

func (app *App) Routes() http.Handler {
	staticDir := "./static/"
	absStaticDir, err := filepath.Abs(staticDir)
	if err != nil {
		log.Fatalf("Failed to get absolute path of static directory: %v", err)
	}
	fs := http.FileServer(http.Dir(absStaticDir))

	mux := http.NewServeMux()
	mux.Handle("GET /static/", http.StripPrefix("/static/", fs))
	mux.HandleFunc("GET /", app.Handlers.ServeIndex)

	return mux
}

func (app *App) RouteChecker(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/static/") {
			next.ServeHTTP(w, r)
			return
		}
		next.ServeHTTP(w, r)
	})
}
