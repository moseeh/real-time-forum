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
	Users    *database.UserModel
	Handlers *handlers.Handler
}

var allowedRoutes = map[string]bool{
	"/":                 true,
	"/api/login":        true,
	"/api/signup":       true,
	"/check-username":   true,
	"/api/logout":       true,
	"/api/categories":   true,
	"/api/allusers":     true,
	"/posts/create":     true,
	"/api/posts":        true,
	"/api/comments":     true,
	"/api/interactions": true,
	"/ws":               true,
	"/api/messages":     true,
	"/api/post/details": true,
}

func (app *App) Routes() http.Handler {
	staticDir := "./static/"
	absStaticDir, err := filepath.Abs(staticDir)
	if err != nil {
		log.Fatalf("Failed to get absolute path of static directory: %v", err)
	}
	fs := http.FileServer(http.Dir(absStaticDir))
	mux := http.NewServeMux()

	// Public routes
	mux.Handle("GET /static/", http.StripPrefix("/static/", fs))
	mux.HandleFunc("GET /", app.Handlers.ServeIndex)
	mux.HandleFunc("POST /api/login", app.Handlers.LoginHandler)
	mux.HandleFunc("POST /api/signup", app.Handlers.SignupHandler)
	mux.HandleFunc("POST /check-username", app.Handlers.ConfirmName)

	// Protected routes with auth middleware
	mux.HandleFunc("POST /api/logout", app.AuthMiddleware(app.Handlers.LogoutHandler))
	mux.HandleFunc("GET /api/categories", app.AuthMiddleware(app.Handlers.GetCategories))
	mux.HandleFunc("POST /api/allusers", app.AuthMiddleware(app.Handlers.GetUsers))
	mux.HandleFunc("POST /posts/create", app.AuthMiddleware(app.Handlers.CreatePost))
	mux.HandleFunc("GET /api/posts", app.AuthMiddleware(app.Handlers.GetPosts))
	mux.HandleFunc("POST /api/comments", app.AuthMiddleware(app.Handlers.HandleComments))
	mux.HandleFunc("POST /api/interactions", app.AuthMiddleware(app.Handlers.HandleInteraction))
	mux.HandleFunc("GET /ws", app.AuthMiddleware(app.Handlers.HandleWebSocket))
	mux.HandleFunc("POST /api/messages", app.AuthMiddleware(app.Handlers.FetchMessages))
	mux.HandleFunc("GET /api/post/details", app.AuthMiddleware(app.Handlers.HandlePostDetails))

	return mux
}

func (app *App) RouteChecker(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/static/") {
			next.ServeHTTP(w, r)
			return
		}

		if _, ok := allowedRoutes[r.URL.Path]; !ok {
			handlers.BadRequestHandler(w,r)
			return
		}
		next.ServeHTTP(w, r)
	})
}
