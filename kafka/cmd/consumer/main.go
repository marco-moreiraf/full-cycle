package main

import (
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {
	consumer := NewKafkaConsumer()

	topics := []string{"teste"}
	consumer.SubscribeTopics(topics, nil)

	for {
		msg, err := consumer.ReadMessage(-1)
		if err == nil {
			fmt.Println(string(msg.Value), msg.TopicPartition)
		}
	}
}

func NewKafkaConsumer() *kafka.Consumer {
	configMap := &kafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
		"client.id":         "go-consumer",
		"group.id":          "go-group",
		"auto.offset.reset": "earliest",
	}

	consumer, err := kafka.NewConsumer(configMap)
	if err != nil {
		log.Println(err.Error())
	}
	return consumer
}
