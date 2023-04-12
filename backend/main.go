package main

import (
	"golang_angular/database"
	"golang_angular/entities"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool)
var broadcaster = make(chan entities.DirectMessage)
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	// Load Configurations from config.json using Viper
	LoadAppConfig()

	// Initialize Database
	database.Connect(AppConfig.ConnectionString)
	database.Migrate()

	http.HandleFunc("/websocket", handleConnections)
	go handleMessages()

	// host the server... keep this last
	host := "127.0.0.1:5000"
	if err := http.ListenAndServe(host, httpHandler()); err != nil {
		log.Fatalf("Failed to listen on %s: %v", host, err)
	}

}
