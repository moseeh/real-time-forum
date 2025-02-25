package handlers

import (
	"fmt"
	"net/http"
)

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Page Not Found</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
           
        <div class="container">
            <h1 class="error-code">404</h1>
            <p class="message">Page not found in the matrix</p>
            <p class="message">The tetromino you're looking for has disappeared!</p>
            <a href="/" class="home-button">Return to Game</a>
        </div>
        <script type="module" src="/static/js/error.js"></script>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}

func ServerErrorHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>500 - Internal Server error</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
        <header class="card">
            <div class="header-content">
                <div class="logo">
                    <a href="/">
                        <h1>Forum</h1>
                    </a>
                </div>
                <div class="header-actions">
                <div class="user-menu">
                    <button class="btn" id="logout-btn">Logout</button>
                </div>
            </div>
        </div>
        </header>
        <div class="container">
            <h1 class="error-code">500</h1>
            <p class="message">Critical system malfunction!</p>
            <p class="message">Engineers dispatched.</p>
            <a href="/" class="home-button">Return to Safety</a>
        </div>
        <script type="module" src="/static/js/error.js"></script>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}

func BadRequestHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusBadRequest)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>400 - Bad Request</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
         <header class="card">
            <div class="header-content">
                <div class="logo">
                    <a href="/">
                        <h1>Forum</h1>
                    </a>
                </div>
                <div class="header-actions">
                <div class="user-menu">
                    <button class="btn" id="logout-btn">Logout</button>
                </div>
            </div>
        </div>
        </header>
        <div class="container">
            <h1 class="error-code">400</h1>
            <p class="message">This request doesn't Exist</p>
            <a href="/" class="home-button">Reinitialize Request</a>
        </div>
        <script type="module" src="/static/js/error.js"></script>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}

func WrongMethodHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 - Wrong Method</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
        <header class="card">
            <div class="header-content">
                <div class="logo">
                    <a href="/">
                        <h1>Forum</h1>
                    </a>
                </div>
                <div class="header-actions">
                <div class="user-menu">
                    <button class="btn" id="logout-btn">Logout</button>
                </div>
            </div>
        </div>
        </header>
        <div class="container">
            <h1 class="error-code">405</h1>
            <p class="message">This Mathod Is Not Allowed</p>
            <p class="message">Try Another one</p>
            <a href="/" class="home-button">Try Different Approach</a>
        </div>
        <script type="module" src="/static/js/error.js"></script>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}

func NotAuthorized(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusUnauthorized)
	w.Header().Set("Content-Type", "text/html")

	html := `
    <!DOCTYPE html>
    <html>
    <head>
        <title>401 - Not Authorized</title>
        <link rel="stylesheet" href="static/css/error.css">
    </head>
    <body>
        <header class="card">
            <div class="header-content">
                <div class="logo">
                    <a href="/">
                        <h1>Forum</h1>
                    </a>
                </div>
                <div class="header-actions">
                <div class="user-menu">
                    <button class="btn" id="logout-btn">Logout</button>
                </div>
            </div>
        </div>
        </header>
        <div class="container">
            <h1 class="error-code">401</h1>
            <p class="message">Looks like You Shouldn't be here</p>
            <a href="/" class="home-button">Probably Login First</a>
        </div>
        <script type="module" src="/static/js/error.js"></script>
    </body>
    </html>
    `

	fmt.Fprint(w, html)
}