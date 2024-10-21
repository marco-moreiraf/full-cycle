package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBalanceCreate(t *testing.T) {
	balance := NewBalance("1234", 100)

	assert.NotNil(t, balance)
	assert.NotNil(t, balance.ID)
	assert.Equal(t, balance.AccountID, "1234")
	assert.Equal(t, balance.Balance, float64(100))
}
