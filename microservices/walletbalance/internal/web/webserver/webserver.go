package webserver

import (
	"fmt"
	"net/http"
)

type Webserver struct {
	Router *http.ServeMux
	Port   string
}

func NewWebserver(port string) *Webserver {
	return &Webserver{
		Router: http.NewServeMux(),
		Port:   port,
	}
}

func (ws *Webserver) Register(path string, handler func(w http.ResponseWriter, r *http.Request)) {
	ws.Router.HandleFunc(path, handler)
}

func (ws *Webserver) Start() {
	fmt.Println("Server is running")
	http.ListenAndServe(ws.Port, ws.Router)
}
