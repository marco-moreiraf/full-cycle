package entity

import (
	"time"

	"github.com/google/uuid"
)

type Balance struct {
	ID        string
	AccountID string
	Balance   float64
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewBalance(accountID string, balance float64) *Balance {
	return &Balance{
		ID:        uuid.New().String(),
		AccountID: accountID,
		Balance:   balance,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
