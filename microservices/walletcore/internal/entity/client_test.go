package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewClient(t *testing.T) {
	client, err := NewClient("Marco", "marco@email.com")
	assert.Nil(t, err)
	assert.NotNil(t, client)
	assert.Equal(t, "Marco", client.Name)
	assert.Equal(t, "marco@email.com", client.Email)
}

func TestCreateNewClientWhenArgsAreInvalid(t *testing.T) {
	client, err := NewClient("", "")
	assert.NotNil(t, err)
	assert.Nil(t, client)
}

func TestUpdateClient(t *testing.T) {
	client, _ := NewClient("Marco", "marco@email.com")
	err := client.Update("Marco Updated", "marco@gmail.com")

	assert.Nil(t, err)
	assert.Equal(t, "Marco Updated", client.Name)
	assert.Equal(t, "marco@gmail.com", client.Email)
}

func TestUpdateClientWithInvalidArgs(t *testing.T) {
	client, _ := NewClient("Marco", "marco@email.com")
	err := client.Update("", "marco@gmail.com")

	assert.NotNil(t, err)
	assert.Error(t, err, "name is required")
}

func TestAddAccountToClient(t *testing.T) {
	client, _ := NewClient("Marco", "marco@email.com")
	account, _ := NewAccount(client)

	err := client.AddAccount(account)

	assert.Nil(t, err)
	assert.Equal(t, 1, len(client.Accounts))
}

func TestAddAccountToClientWithInvalidClientID(t *testing.T) {
	client, _ := NewClient("Marco", "marco@email.com")
	client2, _ := NewClient("Marco 2", "marco2@email.com")
	account, _ := NewAccount(client)

	err := client2.AddAccount(account)

	assert.NotNil(t, err)
	assert.Error(t, err, "account does not belong to client")
	assert.Equal(t, 0, len(client.Accounts))
}
