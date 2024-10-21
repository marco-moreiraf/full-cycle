package database

import (
	"database/sql"

	"github.com/marco-moreiraf/walletbalance/internal/entity"
)

type BalanceDB struct {
	DB *sql.DB
}

func NewBalanceDB(db *sql.DB) *BalanceDB {
	return &BalanceDB{
		DB: db,
	}
}

func (b *BalanceDB) FindByAccountID(accountID string) (*entity.Balance, error) {
	var balance entity.Balance

	stmt, err := b.DB.Prepare("SELECT id, account_id, balance, created_at, updated_at FROM balances WHERE account_id = $1")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(accountID)
	err = row.Scan(&balance.ID, &balance.AccountID, &balance.Balance, &balance.CreatedAt, &balance.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &balance, nil
}

func (b *BalanceDB) Upsert(balance *entity.Balance) error {
	stmt, err := b.DB.Prepare(`
		INSERT INTO balances (id, account_id, balance, created_at, updated_at) 
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (account_id) DO UPDATE SET
			balance = excluded.balance,
			updated_at = excluded.updated_at;
	`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(balance.ID, balance.AccountID, balance.Balance, balance.CreatedAt, balance.UpdatedAt)
	if err != nil {
		return err
	}

	return nil
}
