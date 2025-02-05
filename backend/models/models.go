package models

type User struct {
	ID           string    `json:"id"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	Gender       string `json:"gender"`
	Age          int    `json:"age"`
	PasswordHash string `json:"-"`
}
