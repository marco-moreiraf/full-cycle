package main

import (
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {
	fmt.Println("Olá, mundo")

	deliveryChannel := make(chan kafka.Event)

	producer := NewKafkaProducer()

	Publish("Olá", "teste", producer, []byte("test"), deliveryChannel)

	go DeliveryReport(deliveryChannel)

	// //Síncrono
	// e := <-deliveryChannel
	// msg := e.(*kafka.Message)
	// if msg.TopicPartition.Error != nil {
	// 	fmt.Println("Erro ao enviar")
	// } else {
	// 	fmt.Println("Mensagem enviada", msg.TopicPartition)
	// }

	producer.Flush(5000)
}

func NewKafkaProducer() *kafka.Producer {
	configMap := &kafka.ConfigMap{
		"bootstrap.servers":   "kafka:9092",
		"delivery.timeout.ms": "0",
		"acks":                "all", //0, 1 ou all
		"enable.idempotence":  "true",
	}

	producer, err := kafka.NewProducer(configMap)
	if err != nil {
		log.Println(err.Error())
	}

	return producer
}

func Publish(msg, topic string, producer *kafka.Producer, key []byte, deliveryChannel chan kafka.Event) error {
	message := &kafka.Message{
		Value: []byte(msg),
		TopicPartition: kafka.TopicPartition{
			Topic:     &topic,
			Partition: kafka.PartitionAny,
		},
		Key: key,
	}

	err := producer.Produce(message, deliveryChannel)
	if err != nil {
		return err
	}

	return nil
}

func DeliveryReport(deliveryChan chan kafka.Event) {
	for e := range deliveryChan {
		switch ev := e.(type) {
		case *kafka.Message:
			if ev.TopicPartition.Error != nil {
				fmt.Println("Erro ao enviar")
			} else {
				fmt.Println("Mensagem enviada", ev.TopicPartition)
			}
		}
	}
}
