package handler

import (
	"fmt"
	"sync"

	"github.com/marco-moreiraf/walletcore/pkg/events"
	"github.com/marco-moreiraf/walletcore/pkg/kafka"
)

type BalanceUpdatedKafkaHandler struct {
	Kafka *kafka.Producer
}

func NewBalanceUpdatedKafkaHandler(kafka *kafka.Producer) *BalanceUpdatedKafkaHandler {
	return &BalanceUpdatedKafkaHandler{
		Kafka: kafka,
	}
}

func (h *BalanceUpdatedKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()

	h.Kafka.Publish(message, nil, "balances")
	fmt.Println("BalanceUpdatedKafkaHandler: ", message.GetPayload())
}
