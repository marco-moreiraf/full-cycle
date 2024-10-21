package find_balance

import (
	"testing"

	"github.com/marco-moreiraf/walletbalance/internal/entity"
	"github.com/marco-moreiraf/walletbalance/internal/usecase/mocks"
	"github.com/stretchr/testify/assert"
)

func TestFindBalance_Execute(t *testing.T) {
	balance := entity.NewBalance("1234", 100)

	balanceMock := &mocks.BalanceGatewayMock{}
	balanceMock.On("FindByAccountID", balance.AccountID).Return(balance, nil)

	uc := NewFindBalanceUseCase(balanceMock)
	output, err := uc.Execute(FindBalanceInputDTO{AccountID: balance.AccountID})

	assert.Nil(t, err)
	assert.NotNil(t, output)
	assert.Equal(t, output.ID, balance.ID)
	assert.Equal(t, output.AccountID, balance.AccountID)
	assert.Equal(t, output.Balance, balance.Balance)
	balanceMock.AssertExpectations(t)
	balanceMock.AssertNumberOfCalls(t, "FindByAccountID", 1)
}
