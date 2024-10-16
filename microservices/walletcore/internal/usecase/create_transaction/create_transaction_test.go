package createtransaction

import (
	"testing"

	"github.com/marco-moreiraf/walletcore/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type AccountGatewayMock struct {
	mock.Mock
}

func (m *AccountGatewayMock) Save(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *AccountGatewayMock) FindByID(id string) (*entity.Account, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Account), args.Error(1)
}

type TransactionGatewayMock struct {
	mock.Mock
}

func (m *TransactionGatewayMock) Create(transaction *entity.Transaction) error {
	args := m.Called(transaction)
	return args.Error(0)
}

func TestCreateTransactionUseCase_Execute(t *testing.T) {
	c1, _ := entity.NewClient("C1", "c1@email.com")
	c2, _ := entity.NewClient("C2", "c2@email.com")

	acc1, _ := entity.NewAccount(c1)
	acc2, _ := entity.NewAccount(c2)

	acc1.Credit(1000)

	am := &AccountGatewayMock{}
	am.On("FindByID", acc1.ID).Return(acc1, nil)
	am.On("FindByID", acc2.ID).Return(acc2, nil)

	tm := &TransactionGatewayMock{}
	tm.On("Create", mock.Anything).Return(nil)

	uc := NewCreateTransactionUseCase(tm, am)

	output, err := uc.Execute(CreateTransactionInputDTO{
		AccountIDFrom: acc1.ID,
		AccountIDTo:   acc2.ID,
		Amount:        300,
	})

	assert.Nil(t, err)
	assert.NotNil(t, output)
	assert.NotEmpty(t, output.ID)
	assert.Equal(t, float64(700), acc1.Balance)
	assert.Equal(t, float64(300), acc2.Balance)
	am.AssertExpectations(t)
	am.AssertNumberOfCalls(t, "FindByID", 2)
	tm.AssertExpectations(t)
	tm.AssertNumberOfCalls(t, "Create", 1)
}
