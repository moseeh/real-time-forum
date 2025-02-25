package utils

import (
	"testing"
)

func TestHashPasswordAndCompareHash(t *testing.T) {
	password := "securepassword"

	// Test HashPassword
	hashedPassword, err := HashPassword(password)
	if err != nil {
		t.Fatalf("HashPassword() error = %v", err)
	}

	// Test CompareHash with correct password
	if !CompareHash(hashedPassword, password) {
		t.Errorf("CompareHash() failed: expected true, got false")
	}

	// Test CompareHash with incorrect password
	if CompareHash(hashedPassword, "wrongpassword") {
		t.Errorf("CompareHash() failed: expected false, got true")
	}
}

func TestUUIDGen(t *testing.T) {
	uuid1 := UUIDGen()
	uuid2 := UUIDGen()

	if uuid1 == "" || uuid2 == "" {
		t.Errorf("UUIDGen() returned an empty string")
	}

	if uuid1 == uuid2 {
		t.Errorf("UUIDGen() generated duplicate UUIDs, which is highly unlikely")
	}
}

func TestTokenGen(t *testing.T) {
	token1 := TokenGen(16)
	token2 := TokenGen(16)

	if len(token1) == 0 || len(token2) == 0 {
		t.Errorf("TokenGen() returned an empty string")
	}

	if token1 == token2 {
		t.Errorf("TokenGen() generated duplicate tokens, which is unlikely")
	}
}
