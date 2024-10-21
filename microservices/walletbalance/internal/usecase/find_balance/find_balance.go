package find_balance

import (
	"time"

	"github.com/marco-moreiraf/walletbalance/internal/gateway"
)

type FindBalanceInputDTO struct {
	AccountID string `json:"account_id"`
}

type FindBalanceOutputDTO struct {
	ID        string    `json:"id"`
	AccountID string    `json:"account_id"`
	Balance   float64   `json:"balance"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type FindBalanceUseCase struct {
	BalanceGeteway gateway.BalanceGateway
}

func NewFindBalanceUseCase(gateway gateway.BalanceGateway) *FindBalanceUseCase {
	return &FindBalanceUseCase{
		BalanceGeteway: gateway,
	}
}

func (uc *FindBalanceUseCase) Execute(input FindBalanceInputDTO) (*FindBalanceOutputDTO, error) {
	balance, error := uc.BalanceGeteway.FindByAccountID(input.AccountID)
	if error != nil {
		return nil, error
	}

	return &FindBalanceOutputDTO{
		ID:        balance.ID,
		AccountID: balance.AccountID,
		Balance:   balance.Balance,
		CreatedAt: balance.CreatedAt,
		UpdatedAt: balance.UpdatedAt,
	}, nil
}
