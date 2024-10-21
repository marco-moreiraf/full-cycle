package web

import (
	"encoding/json"
	"net/http"

	"github.com/marco-moreiraf/walletbalance/internal/usecase/find_balance"
	"github.com/marco-moreiraf/walletbalance/internal/usecase/upsert_balance"
)

type BalanceHandler struct {
	FindBalanceUseCase   find_balance.FindBalanceUseCase
	UpsertBalanceUseCase upsert_balance.UpsertBalanceUseCase
}

func NewBalanceHandler(findBalance find_balance.FindBalanceUseCase, upsertBalance upsert_balance.UpsertBalanceUseCase) *BalanceHandler {
	return &BalanceHandler{
		FindBalanceUseCase:   findBalance,
		UpsertBalanceUseCase: upsertBalance,
	}
}

func (h *BalanceHandler) FindBalanceByAccountID(w http.ResponseWriter, r *http.Request) {
	accountID := r.PathValue("account_id")

	output, err := h.FindBalanceUseCase.Execute(find_balance.FindBalanceInputDTO{AccountID: accountID})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(output)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}
