package database

import (
	"database/sql"
	"testing"

	"github.com/marco-moreiraf/walletcore/internal/entity"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type ClientDBTestSuite struct {
	suite.Suite
	db       *sql.DB
	clientDB *ClientDB
}

func (s *ClientDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)

	s.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date, updated_at date)")

	s.clientDB = NewClientDB(db)
}

func (s *ClientDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
}

func TestClientDBTestSuite(t *testing.T) {
	suite.Run(t, new(ClientDBTestSuite))
}

func (s *ClientDBTestSuite) TestGet() {
	client, _ := entity.NewClient("Client", "client@email.com")

	stmt, err := s.db.Prepare("INSERT INTO clients (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
	s.Nil(err)
	defer stmt.Close()

	_, err = stmt.Exec(client.ID, client.Name, client.Email, client.CreatedAt, client.UpdatedAt)
	s.Nil(err)

	clientDB, err := s.clientDB.Get(client.ID)
	s.Nil(err)
	s.Equal(client.ID, clientDB.ID)
	s.Equal(client.Name, clientDB.Name)
	s.Equal(client.Email, clientDB.Email)
}

func (s *ClientDBTestSuite) TestSave() {
	client, _ := entity.NewClient("Client", "client@email.com")

	err := s.clientDB.Save(client)
	s.Nil(err)

	clientDB := &entity.Client{}

	stmt, err := s.db.Prepare("SELECT id, name, email, created_at, updated_at FROM clients WHERE id = ?")
	s.Nil(err)
	defer stmt.Close()

	row := stmt.QueryRow(client.ID)
	err = row.Scan(&clientDB.ID, &clientDB.Name, &clientDB.Email, &clientDB.CreatedAt, &clientDB.UpdatedAt)
	s.Nil(err)

	s.Equal(client.ID, clientDB.ID)
	s.Equal(client.Name, clientDB.Name)
	s.Equal(client.Email, clientDB.Email)
}
