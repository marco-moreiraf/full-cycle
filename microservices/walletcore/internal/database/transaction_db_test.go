package database

import (
	"database/sql"
	"testing"

	"github.com/marco-moreiraf/walletcore/internal/entity"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type TransactionDBTestSuite struct {
	suite.Suite
	db            *sql.DB
	transactionDB *TransactionDB
	client1       *entity.Client
	client2       *entity.Client
	accountFrom   *entity.Account
	accountTo     *entity.Account
}

func (s *TransactionDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)

	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date, updated_at date)")
	db.Exec("CREATE TABLE accounts (id varchar(255), client_id varchar(255), balance float, created_at date, updated_at date)")
	db.Exec("CREATE TABLE transactions (id varchar(255), account_id_from varchar(255), account_id_to varchar(255), amount float, created_at date)")

	s.transactionDB = NewTransactionDB(db)
	s.client1, _ = entity.NewClient("Client1", "client1@email.com")
	s.client2, _ = entity.NewClient("Client2", "client2@email.com")

	s.accountFrom, _ = entity.NewAccount(s.client1)
	s.accountTo, _ = entity.NewAccount(s.client2)

	s.accountFrom.Credit(1000)
}

func (s *TransactionDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE accounts")
	s.db.Exec("DROP TABLE clients")
	s.db.Exec("DROP TABLE transactions")
}

func TestTransactionDBTestSuite(t *testing.T) {
	suite.Run(t, new(ClientDBTestSuite))
}

func (s *TransactionDBTestSuite) TestCreate() {
	transaction, _ := entity.NewTransaction(s.accountFrom, s.accountTo, 100)

	err := s.transactionDB.Create(transaction)
	s.Nil(err)

	transactionDB := &entity.Transaction{}

	stmt, err := s.db.Prepare("SELECT id, account_from_id, account_to_id, amount, created_at FROM transactions WHERE id = ?")
	s.Nil(err)
	defer stmt.Close()

	row := stmt.QueryRow(transaction.ID)
	err = row.Scan(&transactionDB.ID, &transactionDB.AccountFromID, &transactionDB.AccountToID, &transactionDB.Amount, &transactionDB.CreatedAt)
	s.Nil(err)

	s.NotNil(transactionDB)
	s.Equal(transaction.ID, transactionDB.ID)
	s.Equal(transaction.AccountFromID, transactionDB.AccountFromID)
	s.Equal(transaction.AccountToID, transactionDB.AccountToID)
}
