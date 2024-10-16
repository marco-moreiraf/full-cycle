package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateAccount(t *testing.T) {
	client, _ := NewClient("Client", "client@email.com")
	account, err := NewAccount(client)

	assert.Nil(t, err)
	assert.NotNil(t, account)
	assert.Equal(t, client.ID, account.Client.ID)
}

func TestCreateAccountWithInvalidArgs(t *testing.T) {
	account, err := NewAccount(nil)

	assert.Nil(t, account)
	assert.NotNil(t, err)
	assert.Error(t, err, "client is required")
}

func TestCreditAccount(t *testing.T) {
	client, _ := NewClient("Client", "client@email.com")
	account, _ := NewAccount(client)

	account.Credit(100)

	assert.Equal(t, float64(100), account.Balance)
}

func TestDebitAccount(t *testing.T) {
	client, _ := NewClient("Client", "client@email.com")
	account, _ := NewAccount(client)

	account.Credit(100)
	account.Debit(50)

	assert.Equal(t, float64(50), account.Balance)
}
