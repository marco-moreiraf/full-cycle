package db

import (
	"database/sql"

	"github.com/marco-moreiraf/arquitetura-hexagonal/application"
	_ "github.com/mattn/go-sqlite3"
)

type ProductDB struct {
	db *sql.DB
}

func NewProductDB(db *sql.DB) *ProductDB {
	return &ProductDB{db: db}
}

func (p *ProductDB) Get(id string) (application.ProductInterface, error) {
	var product application.Product

	stmt, err := p.db.Prepare("SELECT id, name, price, status FROM products WHERE id = ?")
	if err != nil {
		return nil, err
	}

	err = stmt.QueryRow(id).Scan(&product.ID, &product.Name, &product.Price, &product.Status)
	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (p *ProductDB) Save(product application.ProductInterface) (application.ProductInterface, error) {
	var rows int
	p.db.QueryRow("SELECT count(*) FROM products WHERE id = ?", product.GetID()).Scan(&rows)

	if rows == 0 {
		return p.create(product)
	}

	return p.update(product)
}

func (p *ProductDB) create(product application.ProductInterface) (application.ProductInterface, error) {
	insert := `
		INSERT INTO products(id, name, price, status) VALUES (?, ?, ?, ?)
	`

	stmt, err := p.db.Prepare(insert)
	if err != nil {
		return nil, err
	}

	_, err = stmt.Exec(product.GetID(), product.GetName(), product.GetPrice(), product.GetStatus())
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (p *ProductDB) update(product application.ProductInterface) (application.ProductInterface, error) {
	update := `
		UPDATE products SET name = ?, price = ?, status = ? WHERE id = ?
	`

	stmt, err := p.db.Prepare(update)
	if err != nil {
		return nil, err
	}

	_, err = stmt.Exec(product.GetName(), product.GetPrice(), product.GetStatus(), product.GetID())
	if err != nil {
		return nil, err
	}

	return product, nil
}
