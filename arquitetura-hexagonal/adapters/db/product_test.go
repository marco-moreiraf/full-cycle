package db_test

import (
	"database/sql"
	"log"
	"testing"

	"github.com/marco-moreiraf/arquitetura-hexagonal/adapters/db"
	"github.com/marco-moreiraf/arquitetura-hexagonal/application"
	"github.com/stretchr/testify/require"
)

var Db *sql.DB

func setUp() {
	Db, _ = sql.Open("sqlite3", ":memory:")
	createTable(Db)
	createProduct(Db)
}

func createTable(db *sql.DB) {
	table := `CREATE TABLE products (
		id varchar(255) PRIMARY KEY NOT NULL,
		name varchar(255),
		price float,
		status varchar(255)
	);`

	stmt, err := db.Prepare(table)
	if err != nil {
		log.Fatal(err.Error())
	}

	stmt.Exec()
}

func createProduct(db *sql.DB) {
	insert := `INSERT INTO products  VALUES(
		"abc",
		"Product Test",
		0,
		"disabled"
	);`

	stmt, err := db.Prepare(insert)
	if err != nil {
		log.Fatal(err.Error())
	}

	stmt.Exec()
}

func TestProductDBGet(t *testing.T) {
	setUp()
	defer Db.Close()

	productDB := db.NewProductDB(Db)

	product, err := productDB.Get("abc")
	require.Nil(t, err)
	require.Equal(t, "abc", product.GetID())
	require.Equal(t, "Product Test", product.GetName())
	require.Equal(t, 0.0, product.GetPrice())
	require.Equal(t, application.DISABLED, product.GetStatus())
}

func TestProductDBSave(t *testing.T) {
	setUp()
	defer Db.Close()

	productDB := db.NewProductDB(Db)

	product := application.NewProduct()
	product.Name = "Product Test"
	product.Price = 25

	productResult, err := productDB.Save(product)
	require.Nil(t, err)
	require.Equal(t, product.ID, productResult.GetID())
	require.Equal(t, product.Name, productResult.GetName())
	require.Equal(t, product.Price, productResult.GetPrice())
	require.Equal(t, product.Status, productResult.GetStatus())

	product.Enable()

	productResult, err = productDB.Save(product)
	require.Nil(t, err)
	require.Equal(t, product.ID, productResult.GetID())
	require.Equal(t, product.Name, productResult.GetName())
	require.Equal(t, product.Price, productResult.GetPrice())
	require.Equal(t, product.Status, productResult.GetStatus())
}
