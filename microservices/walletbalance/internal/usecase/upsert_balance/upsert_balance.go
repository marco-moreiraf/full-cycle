package upsert_balance

import (
	"github.com/marco-moreiraf/walletbalance/internal/entity"
	"github.com/marco-moreiraf/walletbalance/internal/gateway"
)

type UpsertBalanceInputDTO struct {
	AccountID string  `json:"account_id"`
	Balance   float64 `json:"balance"`
}

type UpsertBalanceOutputDTO struct{}

type UpsertBalanceUseCase struct {
	BalanceGateway gateway.BalanceGateway
}

func NewUpsertBalanceUseCase(gateway gateway.BalanceGateway) *UpsertBalanceUseCase {
	return &UpsertBalanceUseCase{
		BalanceGateway: gateway,
	}
}

func (uc *UpsertBalanceUseCase) Execute(input UpsertBalanceInputDTO) (*UpsertBalanceOutputDTO, error) {
	balance := entity.NewBalance(input.AccountID, input.Balance)

	err := uc.BalanceGateway.Upsert(balance)
	if err != nil {
		return nil, err
	}

	return &UpsertBalanceOutputDTO{}, nil
}
