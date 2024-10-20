package create_account

import (
	"testing"

	"github.com/marco-moreiraf/walletcore/internal/entity"
	"github.com/marco-moreiraf/walletcore/internal/usecase/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestCreateAccountUseCase_Execute(t *testing.T) {
	client, _ := entity.NewClient("Client", "client@email.com")
	cm := &mocks.ClientGatewayMock{}
	cm.On("Get", client.ID).Return(client, nil)

	am := &mocks.AccountGatewayMock{}
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
