package gateway

import "github.com/marco-moreiraf/walletbalance/internal/entity"

type BalanceGateway interface {
	Upsert(balance *entity.Balance) error
	FindByAccountID(accountID string) (*entity.Balance, error)
}
