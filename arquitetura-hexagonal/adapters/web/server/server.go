package server

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/marco-moreiraf/arquitetura-hexagonal/adapters/web/handler"
	"github.com/marco-moreiraf/arquitetura-hexagonal/application"
	"github.com/urfave/negroni"
)

type Webserver struct {
	Service application.ProductServiceInterface
}

func NewWebserver(service application.ProductServiceInterface) *Webserver {
	return &Webserver{Service: service}
}

func (w Webserver) Serve() {

	r := mux.NewRouter()
	n := negroni.New(
		negroni.NewLogger(),
	)

	handler.MakeProductHandlers(r, n, w.Service)
	http.Handle("/", r)

	server := &http.Server{
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Addr:         ":9000",
		Handler:      http.DefaultServeMux,
		ErrorLog:     log.New(os.Stderr, "log: ", log.Lshortfile),
	}
	err := server.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
