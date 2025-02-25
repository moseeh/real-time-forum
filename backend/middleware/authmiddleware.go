package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"real-time-forum/backend/handlers"
)

// ErrorResponse represents the JSON error structure
type ErrorResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

// SendJSONError sends a JSON error response
func SendJSONError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{
		Status:  "error",
		Message: message,
	})
}

// AuthMiddleware checks for authentication before proceeding
func (app *App) AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/static/") {
			next.ServeHTTP(w, r)
			return
		}
		sessionCookie, err := r.Cookie("session_id")
		if err != nil {
			if err == http.ErrNoCookie {
				handlers.NotAuthorized(w,r)
				return
			}
			handlers.BadRequestHandler(w,r)
			return
		}

		userID, err := app.Users.GetUserIdFromSession(sessionCookie.Value)
		if err != nil {
			handlers.NotAuthorized(w,r)
			return
		}
		// Check if session has expired
		isValid, err := app.Users.IsSessionValid(sessionCookie.Value)
		if err != nil {
			handlers.ServerErrorHandler(w, r)
			return
		}
		if !isValid {
			// Remove expired cookie
			http.SetCookie(w, &http.Cookie{
				Name:     "session_id",
				Value:    "",
				Path:     "/",
				HttpOnly: true,
				Secure:   true,
				SameSite: http.SameSiteStrictMode,
				MaxAge:   -1,
				Expires:  time.Now().Add(-24 * time.Hour),
			})
			handlers.NotAuthorized(w,r)
			return
		}
		// Add user ID to request context for handlers to use
		ctx := context.WithValue(r.Context(), handlers.UserIDKey, userID)
		r = r.WithContext(ctx)
		// Proceed to next handler
		next.ServeHTTP(w, r)
	}
}
