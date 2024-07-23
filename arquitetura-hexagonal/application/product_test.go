package application_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/marco-moreiraf/arquitetura-hexagonal/application"
	"github.com/stretchr/testify/require"
)

func TestProduct_Enable(t *testing.T) {
	product := application.Product{}
	product.Name = "Hello"
	product.Status = application.DISABLED
	product.Price = 10

	err := product.Enable()
	require.Nil(t, err)

	product.Price = 0
	err = product.Enable()
	require.Equal(t, "price must be greater than ZERO to enable the product", err.Error())
}

func TestProduct_Disable(t *testing.T) {
	product := application.Product{}
	product.Name = "Hello"
	product.Status = application.ENABLED
	product.Price = 0

	err := product.Disable()
	require.Nil(t, err)

	product.Price = 10
	err = product.Disable()
	require.Equal(t, "price must be ZERO in order to have product disabled", err.Error())
}

func TestProduct_IsValid(t *testing.T) {
	product := application.Product{}
	product.ID = uuid.NewString()
	product.Name = "Hello"
	product.Price = 10
	product.Status = application.DISABLED

	valid, err := product.IsValid()
	require.Nil(t, err)
	require.Equal(t, true, valid)

	product.Status = "INVALID"
	valid, err = product.IsValid()
	require.Equal(t, "invalid status", err.Error())
	require.Equal(t, false, valid)

	product.Status = application.ENABLED
	valid, err = product.IsValid()
	require.Nil(t, err)
	require.Equal(t, true, valid)

	product.Price = -10
	valid, err = product.IsValid()
	require.Equal(t, "price must be greater or equal ZERO", err.Error())
	require.Equal(t, false, valid)

}
