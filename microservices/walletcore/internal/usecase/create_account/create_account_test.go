package createaccount

import (
	"testing"

	"github.com/marco-moreiraf/walletcore/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type ClientGatewayMock struct {
	mock.Mock
}

func (m *ClientGatewayMock) Save(client *entity.Client) error {
	args := m.Called(client)
	return args.Error(0)
}

func (m *ClientGatewayMock) Get(id string) (*entity.Client, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Client), args.Error(1)
}

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

func TestCreateAccountUseCase_Execute(t *testing.T) {
	client, _ := entity.NewClient("Client", "client@email.com")
	cm := &ClientGatewayMock{}
	cm.On("Get", client.ID).Return(client, nil)

	am := &AccountGatewayMock{}
	am.On("Save", mock.Anything).Return(nil)

	uc := NewCreateAccountUseCase(am, cm)
	inputDto := CreateAccountIputDTO{
		ClientID: client.ID,
	}

	output, err := uc.Execute(inputDto)

	assert.Nil(t, err)
	assert.NotNil(t, output)
	assert.NotEmpty(t, output.ID)
	cm.AssertExpectations(t)
	cm.AssertNumberOfCalls(t, "Get", 1)
	am.AssertExpectations(t)
	am.AssertNumberOfCalls(t, "Save", 1)
}
