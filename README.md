# REAL-TIME FORUM

# Real-Time Forum

A real-time forum application built with Go and JavaScript that enables users to communicate through posts, comments, and private messages.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [WebSocket Implementation](#websocket-implementation)
- [Database Schema](#database-schema)
- [Collaborators](#collaborators)
- [Contributing](#contributing)
- [License](#license)

## Overview

Real-Time Forum is a web application that allows users to interact through posts, comments, and private messaging. The application utilizes WebSockets for real-time functionality and SQLite for data persistence. The backend is written in Go, while the frontend is built with vanilla JavaScript.

## Features

1. **User Authentication**

   - Registration and login system
   - Session management using cookies

2. **Posts Management**

   - Create and read posts
   - Categorize posts for better organization
   - Like/dislike functionality
   - Image upload support

3. **Comments System**

   - Add comments to posts
   - Nested comment replies
   - Like/dislike comments

4. **Real-Time Private Messaging**

   - Send and receive messages instantly
   - Chat history persistence
   - Online status indicators
   - Typing Animation

5. **Updates**
   - Real-time update for posts, likes, comments, and messages for all users

## Technologies Used

### Backend

- **Go**: Server-side programming language
- **SQLite**: Database management
- **Gorilla WebSocket**: WebSocket implementation for Go
- **HTTP Router**: Custom routing implementation

### Frontend

- **JavaScript**: Client-side scripting
- **HTML/CSS**: Structure and styling
- **WebSocket API**: Client-side WebSocket implementation
- **Fetch API**: AJAX requests to the server

### Protocols

- **HTTP/HTTPS**: For RESTful API communication
- **WebSocket Protocol**: For real-time bidirectional communication
  - Implements the WebSocket handshake (HTTP Upgrade)
  - Uses ws:// protocol

## Installation

### Prerequisites

- Go (version 1.23+)
- SQLite
- Git

### Steps

1. Clone the repository:

   ```bash
   git clone https://learn.zone01kisumu.ke/git/aosindo/real-time-forum
   ```

2. Navigate to the project directory:

   ```bash
   cd real-time-forum
   ```

3. Run the make command to build and start the application:

   ```bash
   make
   ```

4. The server will start running on `http://localhost:8000` (or the configured port)

## Usage

1. Open your browser and navigate to `http://localhost:8000`
2. Register a new account or login with existing credentials
3. Explore the forum by browsing posts or creating your own
4. Interact with other users through comments, likes, and private messages

## API Endpoints

The application exposes several RESTful API endpoints for client-server communication:

### Authentication

- `POST /api/signup` - Register a new user
- `POST /api/login` - Authenticate a user
- `POST /api/logout` - Log out and invalidate session

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/post/details` - Get a specific post
- `POST /posts/create` - Create a new post
- `POST /api/interactions` - Like/Dislike

### Comments

- `POST /api/comments` - Add a comment to a post
- `POST /api/interactions` - Like/Dislike

### Messages

- `GET /api/messages` - Send a message via REST API (fallback)

## WebSocket Implementation

The application uses WebSockets to provide real-time functionality:

### Connection

- Client connects to `ws://localhost:8000/ws` with session token authentication
- Server upgrades the HTTP connection to WebSocket protocol

### Message Types

- `chat_message`: Private messages between users
- `updates`: System Updates (likes, comments, etc.)
- `user_status`: Online/offline status updates
- `typing_indicator`: Shows when a user is typing

### Protocol

1. Connection is established with HTTP upgrade request
2. Authentication is performed using session cookies
3. JSON messages are exchanged between client and server

## Database Schema

The application uses SQLite with the following main tables:

- `users`: User information and authentication
- `sessions`: User session data
- `posts`: Forum posts with category relationships
- `comments`: Comments on posts and replies
- `interactions`: Tracks likes/dislikes on posts and comments
- `messages`: Private messages between users
- `categories`: Post categorization

## Collaborators

[Andrew Osindo](https://github.com/andyosyndoh)

[Moses Onyango](https://github.com/moseeh)

## Contributing

We welcome contributions to the Real-Time Forum project. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
