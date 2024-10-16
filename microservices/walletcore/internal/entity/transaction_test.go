package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateTransaction(t *testing.T) {
	client1, _ := NewClient("Client1", "c1@email.com")
	client2, _ := NewClient("Client2", "c2@email.com")
	acc1, _ := NewAccount(client1)
	acc2, _ := NewAccount(client2)

	acc1.Credit(1000)

	transaction, err := NewTransaction(acc1, acc2, 500)

	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.Equal(t, acc1, transaction.AccountFrom)
	assert.Equal(t, acc2, transaction.AccountTo)
	assert.Equal(t, float64(500), transaction.Amount)
	assert.Equal(t, float64(500), acc1.Balance)
	assert.Equal(t, float64(500), acc2.Balance)
}

func TestCreateTransactionWithInsufficientFunds(t *testing.T) {
	client1, _ := NewClient("Client1", "c1@email.com")
	client2, _ := NewClient("Client2", "c2@email.com")
	acc1, _ := NewAccount(client1)
	acc2, _ := NewAccount(client2)

	acc1.Credit(100)

	transaction, err := NewTransaction(acc1, acc2, 500)

	assert.NotNil(t, err)
	assert.Nil(t, transaction)
	assert.Error(t, err, "insufficient funds")
	assert.Equal(t, float64(100), acc1.Balance)
}

func TestCreateTransactionWithInvalidAmount(t *testing.T) {
	client1, _ := NewClient("Client1", "c1@email.com")
	client2, _ := NewClient("Client2", "c2@email.com")
	acc1, _ := NewAccount(client1)
	acc2, _ := NewAccount(client2)

	acc1.Credit(100)

	transaction, err := NewTransaction(acc1, acc2, -100)

	assert.NotNil(t, err)
	assert.Nil(t, transaction)
	assert.Error(t, err, "amount must be greater than zero")
	assert.Equal(t, float64(100), acc1.Balance)
}
