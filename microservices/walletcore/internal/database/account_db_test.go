package database

import (
	"database/sql"
	"testing"

	"github.com/marco-moreiraf/walletcore/internal/entity"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type AccountDBTestSuite struct {
	suite.Suite
	db        *sql.DB
	accountDB *AccountDB
	client    *entity.Client
}

func (s *AccountDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)

	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date, updated_at date)")
	db.Exec("CREATE TABLE accounts (id varchar(255), client_id varchar(255), balance float, created_at date, updated_at date)")

	s.accountDB = NewAccountDB(db)
	s.client, _ = entity.NewClient("Client", "client@email.com")

}

func (s *AccountDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE accounts")
	s.db.Exec("DROP TABLE clients")
}

func TestAccountDBTestSuite(t *testing.T) {
	suite.Run(t, new(AccountDBTestSuite))
}

func (s *AccountDBTestSuite) TestSave() {
	account, _ := entity.NewAccount(s.client)

	_, err := s.db.Exec(
		"INSERT INTO clients (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		s.client.ID, s.client.Name, s.client.Email, s.client.CreatedAt, s.client.UpdatedAt,
	)
	s.Nil(err)

	err = s.accountDB.Save(account)
	s.Nil(err)

	var accountDB entity.Account
	var clientDB entity.Client
	accountDB.Client = &clientDB

	stmt, err := s.db.Prepare(`
		SELECT a.id, a.client_id, a.balance, a.created_at, a.updated_at, 
				c.id, c.name, c.email, c.created_at, c.updated_at 
		FROM accounts a 
		INNER JOIN clients c ON a.client_id = c.id 
		WHERE a.id = ?
	`)
	s.Nil(err)
	defer stmt.Close()

	row := stmt.QueryRow(account.ID)
	err = row.Scan(
		&accountDB.ID,
		&accountDB.ClientID,
		&accountDB.Balance,
		&accountDB.CreatedAt,
		&accountDB.UpdatedAt,
		&clientDB.ID,
		&clientDB.Name,
		&clientDB.Email,
		&clientDB.CreatedAt,
		&clientDB.UpdatedAt,
	)
	s.Nil(err)

	s.NotNil(accountDB)
	s.NotNil(clientDB)
	s.Equal(account.ID, accountDB.ID)
	s.Equal(account.ClientID, accountDB.ClientID)
	s.Equal(account.Balance, accountDB.Balance)
	s.Equal(account.Client.ID, accountDB.Client.ID)
	s.Equal(account.Client.Name, accountDB.Client.Name)
	s.Equal(account.Client.Email, accountDB.Client.Email)
}

func (s *AccountDBTestSuite) TestFindByID() {
	account, _ := entity.NewAccount(s.client)

	_, err := s.db.Exec(
		"INSERT INTO clients (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		s.client.ID, s.client.Name, s.client.Email, s.client.CreatedAt, s.client.UpdatedAt,
	)
	s.Nil(err)

	_, err = s.db.Exec(
		"INSERT INTO accounts (id, client_id, balance, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		account.ID, account.ClientID, account.Balance, account.CreatedAt, account.UpdatedAt,
	)
	s.Nil(err)

	accountDB, err := s.accountDB.FindByID(account.ID)
	s.Nil(err)
	s.Equal(account.ID, accountDB.ID)
	s.Equal(account.ClientID, accountDB.ClientID)
	s.Equal(account.Balance, accountDB.Balance)
	s.Equal(account.Client.ID, accountDB.Client.ID)
	s.Equal(account.Client.Name, accountDB.Client.Name)
	s.Equal(account.Client.Email, accountDB.Client.Email)

	s.Nil(err)
}

func (s *AccountDBTestSuite) TestUpdateBalance() {
	account, _ := entity.NewAccount(s.client)

	_, err := s.db.Exec(
		"INSERT INTO clients (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		s.client.ID, s.client.Name, s.client.Email, s.client.CreatedAt, s.client.UpdatedAt,
	)
	s.Nil(err)

	_, err = s.db.Exec(
		"INSERT INTO accounts (id, client_id, balance, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
		account.ID, account.ClientID, account.Balance, account.CreatedAt, account.UpdatedAt,
	)
	s.Nil(err)

	account.Credit(1000)

	err = s.accountDB.UpdateBalance(account)
	s.Nil(err)

	accountDB, err := s.accountDB.FindByID(account.ID)
	s.Nil(err)

	s.Equal(float64(1000), accountDB.Balance)
}
