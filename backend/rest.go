package main

import (
	"encoding/json"
	"fmt"
	"golang_angular/database"
	"golang_angular/entities"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// httpHandler creates the backend HTTP router for queries, types,
// and serving the Angular frontend.
func httpHandler() http.Handler {
	router := mux.NewRouter().StrictSlash(true)

	server := NewServer()
	// Your REST API requests go here
	// each request defines what function will be called for the respective url.
	// each URL can only have one of each get, post, etc .. or it will use the first

	// ** Get Routes ** //
	router.HandleFunc("/api/users", GetUsers).Methods("GET")
	router.HandleFunc("/api/users/{id}", GetUserById).Methods("GET")

	// ** Post Routes ** //
	router.HandleFunc("/api/users", CreateUser).Methods("POST")
	router.HandleFunc("/api/listings", CreateListing).Methods("POST")
	router.HandleFunc("/api/tags", AddTags).Methods("POST")

	// ** Put Routes ** //
	router.HandleFunc("/api/users/{id}", UpdateUser).Methods("PUT")
	router.HandleFunc("/api/tags", UpdateTags).Methods("PUT")

	// ** Delete Routes ** //
	router.HandleFunc("/api/users/{id}", DeleteUser).Methods("DELETE")
	router.HandleFunc("/api/tags", DeleteTags).Methods("DELETE")

	// ** Normal Routes ** //
	// Pages/Authentication
	router.HandleFunc("/api/welcome", Welcome)
	router.HandleFunc("/api/signin", Login)
	router.HandleFunc("/api/refresh", Refresh)
	router.HandleFunc("/api/logout", Logout)
	router.HandleFunc("/api/validAdmin", ValidAdmin)

	//Searches
	router.HandleFunc("/api/search", FindUsersWithSearch)
	router.HandleFunc("/api/tagging", TestSameTagsOther)

	// Friend Request routes
	router.HandleFunc("/api/sendFriendRequest", SendFriendRequest)
	router.HandleFunc("/api/acceptFriendRequest", AcceptFriendRequest)
	router.HandleFunc("/api/removeFriend", RemoveFriend)
	router.HandleFunc("/api/retrieveFriends", RetrieveFriends)

	// Admin Routes
	router.HandleFunc("/api/acceptUser", AcceptUser)
	router.HandleFunc("/api/denyUser", DenyUser)
	router.HandleFunc("/api/banUser", BanUser)

	// Web Sockets
	router.HandleFunc("/api/ws", func(w http.ResponseWriter, r *http.Request) {
		sender := r.URL.Query().Get("sender")
		var receiver string
		var message string
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }

		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println(err)
		}

		server.conns[ws] = sender

		fmt.Println("Client Successfully Connected...")
		server.readLoop(ws, sender, &receiver, &message)
		server.writeLoop(ws, sender, receiver, message)
	})

	router.HandleFunc("/api/getAllOnlineUsers", func(w http.ResponseWriter, r *http.Request) {
		sender := r.URL.Query().Get("sender")
		var allOnlineUsers map[string]bool

		for _, values := range server.conns {
			if values != sender {
				allOnlineUsers[values] = true
			}
		}
		// Get the usernames of everyone who is online

		var allFriends []entities.SingleColumnValue
		database.Instance.Raw(`SELECT DISTINCT reciever AS single_value
							   FROM connections;
							   WHERE sender = ?
							   UNION 
							   SELECT DISTINCT sender AS single_value
							   FROM connections
							   WHERE reciever = ?`, sender, sender).Find(&allFriends)
		// Get all connections/friends of the sender

		var onlineUsers []entities.User
		var tempUser entities.User
		for i := 0; i < len(allFriends); i++ {
			_, ok := allOnlineUsers[allFriends[i].Value]
			if ok {
				database.Instance.Where("username = ?", allFriends[i].Value).Find(&tempUser)
				onlineUsers = append(onlineUsers, tempUser)
			}
			// For each value, if friend is in the online slice (which is being checked with value of ok), appends this value to users
		}

		if len(onlineUsers) > 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(onlineUsers)
		} else {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode("No friends currently online")
		}

	})
	// WARNING: this route must be the last route defined.
	router.PathPrefix("/").Handler(AngularHandler).Methods("GET")

	/**
	 * We need some headers to be statically prepended to every response.
	 */
	return handlers.LoggingHandler(os.Stdout,
		handlers.CORS(
			handlers.AllowCredentials(),
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization",
				"DNT", "Keep-Alive", "User-Agent", "X-Requested-With", "If-Modified-Since",
				"Cache-Control", "Content-Range", "Range"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"http://localhost:8080"}),
			handlers.ExposedHeaders([]string{"DNT", "Keep-Alive", "User-Agent",
				"X-Requested-With", "If-Modified-Since", "Cache-Control",
				"Content-Type", "Content-Range", "Range", "Content-Disposition"}),
			handlers.MaxAge(86400),
		)(router))
}
