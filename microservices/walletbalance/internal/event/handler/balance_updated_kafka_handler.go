package handler

import (
	"fmt"
	"sync"

	"github.com/marco-moreiraf/walletbalance/internal/usecase/upsert_balance"
	"github.com/marco-moreiraf/walletbalance/pkg/events"
)

type BalanceUpdatedPayloadDTO struct {
	AccountIDFrom        string  `json:"account_id_from"`
	AccountIDTo          string  `json:"account_id_to"`
	BalanceAccountIDFrom float64 `json:"balance_account_id_from"`
	BalanceAccountIDTo   float64 `json:"balance_account_id_to"`
}

type BalanceUpdatedKafkaHandler struct {
	UpsertBalanceUseCase *upsert_balance.UpsertBalanceUseCase
}

func NewBalanceUpdatedKafkaHandler(upsert *upsert_balance.UpsertBalanceUseCase) *BalanceUpdatedKafkaHandler {
	return &BalanceUpdatedKafkaHandler{
		UpsertBalanceUseCase: upsert,
	}
}

func (h *BalanceUpdatedKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()

	h.UpsertBalanceUseCase.Execute(upsert_balance.UpsertBalanceInputDTO{
		AccountID: message.GetPayload().(BalanceUpdatedPayloadDTO).AccountIDFrom,
		Balance:   message.GetPayload().(BalanceUpdatedPayloadDTO).BalanceAccountIDFrom,
	})

	h.UpsertBalanceUseCase.Execute(upsert_balance.UpsertBalanceInputDTO{
		AccountID: message.GetPayload().(BalanceUpdatedPayloadDTO).AccountIDTo,
		Balance:   message.GetPayload().(BalanceUpdatedPayloadDTO).BalanceAccountIDTo,
	})

	fmt.Println("BalanceUpdatedKafkaHandler: ", message.GetPayload())
}
