package database

import (
	"database/sql"
	"testing"

	"github.com/marco-moreiraf/walletbalance/internal/entity"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type BalanceDBTestSuite struct {
	suite.Suite
	db        *sql.DB
	balanceDB *BalanceDB
	balance   *entity.Balance
}

func (s *BalanceDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)

	s.db = db
	db.Exec("CREATE TABLE balances (id varchar(255) PRIMARY KEY, account_id varchar(255) NOT NULL, balance float, created_at date, updated_at date, UNIQUE(account_id))")

	s.balanceDB = NewBalanceDB(db)
	s.balance = entity.NewBalance("1234", 1000)
}

func (s *BalanceDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE balances")
}

func TestAccountDBTestSuite(t *testing.T) {
	suite.Run(t, new(BalanceDBTestSuite))
}

func (s *BalanceDBTestSuite) TestFindByAccountID() {
	_, err := s.db.Exec(
		"INSERT INTO balances (id, account_id, balance, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		s.balance.ID, s.balance.AccountID, s.balance.Balance, s.balance.CreatedAt, s.balance.UpdatedAt,
	)
	s.Nil(err)

	balanceDB, err := s.balanceDB.FindByAccountID(s.balance.AccountID)

	s.Nil(err)
	s.NotNil(balanceDB)
	s.Equal(s.balance.ID, balanceDB.ID)
	s.Equal(s.balance.AccountID, balanceDB.AccountID)
	s.Equal(s.balance.Balance, balanceDB.Balance)
}

func (s *BalanceDBTestSuite) TestUpsert() {
	balance1 := entity.NewBalance("1234", 100)
	balance2 := entity.NewBalance("1234", 200)
	var balanceDB entity.Balance

	err := s.balanceDB.Upsert(balance1)
	s.Nil(err)

	err = s.db.QueryRow(
		"SELECT id, account_id, balance, created_at, updated_at FROM balances WHERE account_id = ?", balance1.AccountID).Scan(
		&balanceDB.ID, &balanceDB.AccountID, &balanceDB.Balance, &balanceDB.CreatedAt, &balanceDB.UpdatedAt,
	)
	s.Nil(err)
	s.NotNil(balanceDB)
	s.Equal(balance1.ID, balanceDB.ID)
	s.Equal(balance1.AccountID, balanceDB.AccountID)
	s.Equal(balance1.Balance, balanceDB.Balance)

	err = s.balanceDB.Upsert(balance2)
	s.Nil(err)

	err = s.db.QueryRow(
		"SELECT id, account_id, balance, created_at, updated_at FROM balances").Scan(
		&balanceDB.ID, &balanceDB.AccountID, &balanceDB.Balance, &balanceDB.CreatedAt, &balanceDB.UpdatedAt,
	)
	s.Nil(err)
	s.NotNil(balanceDB)
	s.Equal(balance1.ID, balanceDB.ID)
	s.Equal(balance2.AccountID, balanceDB.AccountID)
	s.Equal(balance2.Balance, balanceDB.Balance)
}
