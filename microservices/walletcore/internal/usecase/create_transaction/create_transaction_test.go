package create_transaction

import (
	"context"
	"fmt"
	"testing"

	"github.com/marco-moreiraf/walletcore/internal/entity"
	"github.com/marco-moreiraf/walletcore/internal/event"
	"github.com/marco-moreiraf/walletcore/internal/usecase/mocks"
	"github.com/marco-moreiraf/walletcore/pkg/events"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestCreateTransactionUseCase_Execute(t *testing.T) {
	c1, _ := entity.NewClient("C1", "c1@email.com")
	c2, _ := entity.NewClient("C2", "c2@email.com")

	acc1, _ := entity.NewAccount(c1)
	acc2, _ := entity.NewAccount(c2)

	acc1.Credit(1000)

	um := &mocks.UowMock{}
	um.On("Do", mock.Anything, mock.Anything).Return(nil)

	inputDTO := CreateTransactionInputDTO{
		AccountIDFrom: acc1.ID,
		AccountIDTo:   acc2.ID,
		Amount:        300,
	}

	dispatcher := events.NewEventDispatcher()
	eventTransaction := event.NewTransactionCreated()
	eventBalance := event.NewBalanceUpdated()
	ctx := context.Background()

	uc := NewCreateTransactionUseCase(um, dispatcher, eventTransaction, eventBalance)

	output, err := uc.Execute(ctx, inputDTO)
	fmt.Println(output)

	assert.Nil(t, err)
	assert.NotNil(t, output)
	// assert.NotEmpty(t, output.ID)
	// assert.Equal(t, float64(700), acc1.Balance)
	// assert.Equal(t, float64(300), acc2.Balance)
	um.AssertExpectations(t)
	um.AssertNumberOfCalls(t, "Do", 1)
}
