package main

import (
	"database/sql"
	"encoding/json"
	"fmt"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/lib/pq"
	"github.com/marco-moreiraf/walletbalance/internal/database"
	"github.com/marco-moreiraf/walletbalance/internal/event"
	"github.com/marco-moreiraf/walletbalance/internal/event/handler"
	"github.com/marco-moreiraf/walletbalance/internal/usecase/find_balance"
	"github.com/marco-moreiraf/walletbalance/internal/usecase/upsert_balance"
	"github.com/marco-moreiraf/walletbalance/internal/web"
	"github.com/marco-moreiraf/walletbalance/internal/web/webserver"
	"github.com/marco-moreiraf/walletbalance/pkg/events"
	"github.com/marco-moreiraf/walletbalance/pkg/kafka"
)

func main() {
	db, err := sql.Open("postgres", fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", "balance-db", 5432, "root", "root", "balance"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "balance",
		"auto.offset.reset": "earliest",
	}
	kafkaConsumer := kafka.NewConsumer(&configMap, []string{"balances"})

	balanceDB := database.NewBalanceDB(db)

	findBalanceUseCase := find_balance.NewFindBalanceUseCase(balanceDB)
	upsertBalanceUseCase := upsert_balance.NewUpsertBalanceUseCase(balanceDB)

	balanceHandler := web.NewBalanceHandler(*findBalanceUseCase, *upsertBalanceUseCase)

	webserver := webserver.NewWebserver(":3003")
	webserver.Register("GET /balances/{account_id}", balanceHandler.FindBalanceByAccountID)
	go webserver.Start()

	eventDispatcher := events.NewEventDispatcher()
	balanceUpdatedEvent := event.NewBalanceUpdated()
	eventDispatcher.Register(balanceUpdatedEvent.GetName(), handler.NewBalanceUpdatedKafkaHandler(upsertBalanceUseCase))

	balanceMessages := make(chan *ckafka.Message)

	go kafkaConsumer.Consume(balanceMessages)

	for message := range balanceMessages {

		var balanceEvent *event.BalanceUpdated
		err := json.Unmarshal(message.Value, &balanceEvent)
		if err != nil {
			fmt.Println("Error unmarshal:", err.Error())
			continue
		}

		var payload handler.BalanceUpdatedPayloadDTO
		payloadBytes, err := json.Marshal(balanceEvent.Payload)
		if err != nil {
			fmt.Println("Error marshal payload:", err.Error())
			continue
		}

		err = json.Unmarshal(payloadBytes, &payload)
		if err != nil {
			fmt.Println("Error unmarshal payload:", err.Error())
			continue
		}

		balanceEvent.Payload = payload

		fmt.Printf("MAIN - message: %s\n", string(message.Value))

		err = eventDispatcher.Dispatch(balanceEvent)
		if err != nil {
			fmt.Println("Error dipatch:", err.Error())
			continue
		}
	}
}
