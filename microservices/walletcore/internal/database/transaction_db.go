package database

import (
	"database/sql"

	"github.com/marco-moreiraf/walletcore/internal/entity"
)

type TransactionDB struct {
	DB *sql.DB
}

func NewTransactionDB(db *sql.DB) *TransactionDB {
	return &TransactionDB{
		DB: db,
	}
}

func (t *TransactionDB) Create(transction *entity.Transaction) error {
	stmt, err := t.DB.Prepare("INSERT INTO transactions (id, account_id_from, account_id_to, amount, created_at) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(transction.ID, transction.AccountFromID, transction.AccountToID, transction.Amount, transction.CreatedAt)
	if err != nil {
		return err
	}

	return nil
}
