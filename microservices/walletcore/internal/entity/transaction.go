package entity

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID            string
	AccountFrom   *Account
	AccountFromID string
	AccountTo     *Account
	AccountToID   string
	Amount        float64
	CreatedAt     time.Time
}

func NewTransaction(accountFrom, accountTo *Account, amount float64) (*Transaction, error) {
	transaction := &Transaction{
		ID:            uuid.New().String(),
		AccountFrom:   accountFrom,
		AccountFromID: accountFrom.ID,
		AccountTo:     accountTo,
		AccountToID:   accountTo.ID,
		Amount:        amount,
		CreatedAt:     time.Now(),
	}

	err := transaction.Validate()
	if err != nil {
		return nil, err
	}

	transaction.Commit()

	return transaction, err
}

func (t *Transaction) Commit() {
	t.AccountFrom.Debit(t.Amount)
	t.AccountTo.Credit(t.Amount)
}

func (t *Transaction) Validate() error {
	if t.Amount <= 0 {
		return errors.New("amount must be greater than zero")
	}
	if t.AccountFrom.Balance < t.Amount {
		return errors.New("insufficient funds")
	}
	return nil
}
