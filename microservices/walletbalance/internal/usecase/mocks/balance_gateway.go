package mocks

import (
	"github.com/marco-moreiraf/walletbalance/internal/entity"
	"github.com/stretchr/testify/mock"
)

type BalanceGatewayMock struct {
	mock.Mock
}

func (m *BalanceGatewayMock) FindByAccountID(accountID string) (*entity.Balance, error) {
	args := m.Called(accountID)
	return args.Get(0).(*entity.Balance), args.Error(1)
}

func (m *BalanceGatewayMock) Upsert(balance *entity.Balance) error {
	args := m.Called(balance)
	return args.Error(0)
}
