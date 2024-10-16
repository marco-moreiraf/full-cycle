package gateway

import "github.com/marco-moreiraf/walletcore/internal/entity"

type AccountGateway interface {
	Save(account *entity.Account) error
	FindByID(id string) (*entity.Account, error)
}
