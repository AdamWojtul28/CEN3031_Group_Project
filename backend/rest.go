package main

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// httpHandler creates the backend HTTP router for queries, types,
// and serving the Angular frontend.
func httpHandler() http.Handler {
	router := mux.NewRouter().StrictSlash(true)
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
	router.HandleFunc("/api/startSocket", webSocket)

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
