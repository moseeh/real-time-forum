package models

type User struct {
	ID           string `json:"id"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Gender       string `json:"gender"`
	Age          int    `json:"age"`
	PasswordHash string `json:"-"`
}

type Content struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	Text         string `json:"text"`
	AuthorID     string `json:"authorid"`
	ContentType  string `json:"type"`
	ParentID     string `json:"parentid"`
	LikesCount   int    `json:"likescount"`
	DislikeCount int    `json:"dislikecount"`
	CommentCount int    `json:"commentcount"`
}

type UserInteraction struct {
	InteractionID   string `json:"interactionid"`
	UserID          string `json:"userid"`
	ContentID       string `json:"contentid"`
	InteractionType string `json:"interactiontype"`
}
