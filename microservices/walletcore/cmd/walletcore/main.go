package main

import (
	"context"
	"database/sql"
	"fmt"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
	"github.com/marco-moreiraf/walletcore/internal/database"
	"github.com/marco-moreiraf/walletcore/internal/event"
	"github.com/marco-moreiraf/walletcore/internal/event/handler"
	"github.com/marco-moreiraf/walletcore/internal/usecase/create_account"
	"github.com/marco-moreiraf/walletcore/internal/usecase/create_client"
	"github.com/marco-moreiraf/walletcore/internal/usecase/create_transaction"
	"github.com/marco-moreiraf/walletcore/internal/web"
	"github.com/marco-moreiraf/walletcore/internal/web/webserver"
	"github.com/marco-moreiraf/walletcore/pkg/events"
	"github.com/marco-moreiraf/walletcore/pkg/kafka"
	"github.com/marco-moreiraf/walletcore/pkg/uow"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "wallet-db", "3306", "wallet"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}
	kafkaProducer := kafka.NewKafkaProducer(&configMap)

	eventDispatcher := events.NewEventDispatcher()
	transactionCreatedEvent := event.NewTransactionCreated()
	eventDispatcher.Register(transactionCreatedEvent.GetName(), handler.NewTransactionCreatedKafkaHandler(kafkaProducer))

	balanceUpdatedEvent := event.NewBalanceUpdated()
	eventDispatcher.Register(balanceUpdatedEvent.GetName(), handler.NewBalanceUpdatedKafkaHandler(kafkaProducer))

	clientDB := database.NewClientDB(db)
	accountDB := database.NewAccountDB(db)

	ctx := context.Background()
	uow := uow.NewUoW(ctx, db)

	uow.Register("AccountDB", func(tx *sql.Tx) interface{} {
		return database.NewAccountDB(db)
	})

	uow.Register("TransactionDB", func(tx *sql.Tx) interface{} {
		return database.NewTransactionDB(db)
	})

	createClientUseCase := create_client.NewCreateClientUseCase(clientDB)
	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDB, clientDB)
	createTransactionUseCase := create_transaction.NewCreateTransactionUseCase(uow, eventDispatcher, transactionCreatedEvent, balanceUpdatedEvent)

	webserver := webserver.NewWebServer(":8080")

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUseCase)

	webserver.AddHandler("/clients", clientHandler.CreateClient)
	webserver.AddHandler("/accounts", accountHandler.CreateAccount)
	webserver.AddHandler("/transactions", transactionHandler.CreateTransaction)

	fmt.Println("Server is running")
	webserver.Start()
}
