package sockets

type Hub struct {
	clients  map[*Client]bool
	active   chan *Client
	inactive chan *Client
}

// Hub maintains the set of active clients and broadcasts messages to the clients.

func NewHub() *Hub {
	return &Hub{
		clients:  make(map[*Client]bool),
		active:   make(chan *Client),
		inactive: make(chan *Client),
	}
}

// NewHub will will give an instance of an Hub

func (hub *Hub) Run() {
	for {
		select {
		case client := <-hub.active:
			HandleUserRegisterEvent(hub, client)

		case client := <-hub.inactive:
			HandleUserDisconnectEvent(hub, client)
		}
	}
}

// Run will execute Go Routines to check incoming Socket events
