package gateway

import "github.com/marco-moreiraf/walletcore/internal/entity"

type TransactionGateway interface {
	Create(transaction *entity.Transaction) error
}
