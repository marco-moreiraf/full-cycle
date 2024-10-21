package upsert_balance

import (
	"testing"

	"github.com/marco-moreiraf/walletbalance/internal/usecase/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUpsertBalanceUseCase_Execute(t *testing.T) {
	balanceMock := &mocks.BalanceGatewayMock{}
	balanceMock.On("Upsert", mock.Anything).Return(nil)

	uc := NewUpsertBalanceUseCase(balanceMock)
	output, err := uc.Execute(UpsertBalanceInputDTO{
		AccountID: "1234",
		Balance:   float64(1000),
	})

	assert.Nil(t, err)
	assert.NotNil(t, output)
	balanceMock.AssertExpectations(t)
	balanceMock.AssertNumberOfCalls(t, "Upsert", 1)
}
