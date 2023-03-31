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

	// ** Delete Routes ** //
	router.HandleFunc("/api/users/{id}", DeleteUser).Methods("DELETE")

	// ** Normal Routes ** //
	// Pages/Authentication
	router.HandleFunc("/api/welcome", Welcome)
	router.HandleFunc("/api/signin", UserLoginAttempt)
	router.HandleFunc("/api/refresh", Refresh)
	router.HandleFunc("/api/logout", Logout)

	//Searches
	router.HandleFunc("/api/search", FindUsersWithSearch)

	// Friend Request routes
	router.HandleFunc("/api/sendFriendRequest", SendFriendRequest)
	router.HandleFunc("/api/acceptFriendRequest", AcceptFriendRequest)
	router.HandleFunc("/api/removeFriend", RemoveFriend)

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
