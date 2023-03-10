package main

import (
	"encoding/json"
	"fmt"
	"golang_angular/database"
	"golang_angular/entities"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

// ** CREATE USER ** //
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)
	userName := user.Username
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)
	if CheckIfUserNameExists(userName) {
		w.WriteHeader(409)
		// 'Conflict' HTTP response status code for duplicate username
		json.NewEncoder(w).Encode("Username is Taken!")
		return
	}
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPassword)
	database.Instance.Create(&user)
	w.WriteHeader(202)
	// Code for 'Accepted' when unique username
	json.NewEncoder(w).Encode(user)
}

// ** CHECK FUNCTIONS ** //
func CheckIfUserIdExists(userId string) bool {
	var user entities.User
	database.Instance.First(&user, userId)
	if user.ID == 0 {
		return false
	}
	return true
}

func CheckIfUserNameExists(userName string) bool {
	var user entities.User
	result := database.Instance.Where("username = ?", userName).First(&user)
	err := result.Scan(&user)
	if err != nil {
		if user.Username == userName {
			return true
		}
	}
	return false
}

func CheckIfExactUserExists(userName string, password string) bool {
	var user entities.User
	result := database.Instance.Where("username = ? AND password = ?", userName, password).First(&user)
	err := result.Scan(&user)
	if err != nil {
		if user.Username == userName && user.Password == password {
			return true
		}
	}
	return false
}

func CompareHashes(user entities.User) bool {
	userName := user.Username
	password := user.Password
	var dbUser entities.User
	result := database.Instance.Where("username = ?", userName).First(&dbUser)
	err := result.Scan(&dbUser)
	fmt.Println(dbUser.Password)
	if err != nil {
		if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(password)); err != nil {
			// If the two passwords don't match, return a 401 status
			return false
		}
	}
	return true
}

func ValidToken(token string) (bool, entities.User) {
	var user entities.User
	result := database.Instance.Where("session_token = ?", token).First(&user)
	err := result.Scan(&user)
	if err != nil {
		if user.Session_Token == token {
			return true, user
		}
	}
	return false, user
}

// ** AUTHENTICATION/QUERY FUNCTIONS ** //
func UserLoginAttempt(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)
	userName := user.Username
	password := user.Password
	fmt.Println(password)
	if !(CheckIfUserNameExists(userName)) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("No such username exists!")
		return
		// Checks if username does not exist
	}
	if !(CompareHashes(user)) {
		w.WriteHeader(401)
		json.NewEncoder(w).Encode("Incorrect password!")
		return
		// Checks if username exists, but password is incorrect
	}
	// create new random session token
	sessionToken := uuid.New().String()
	expiresAt := time.Now().Add(120 * time.Second)
	user.Expiry = expiresAt
	user.Session_Token = sessionToken

	// set client cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   sessionToken,
		Expires: expiresAt,
	})
	w.WriteHeader(202)
	// Code for 'Accepted'
	json.NewEncoder(w).Encode("Proceed to page!")
	// Checks if username and password check out, from here, proceed to profile page
}

func Welcome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)

	// get sesssion cookie
	c, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	sessionToken := c.Value

	// check if this session token exists in database
	exists, dbUser := ValidToken(sessionToken)
	if !exists {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// check if session is expired
	if dbUser.Expiry.Before(time.Now()) {
		// delete session
		dbUser.Session_Token = ""
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	// if session is valid
	w.Write([]byte(fmt.Sprintf("Welcome %s!", user.Username)))
}

func Refresh(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)

	// get sesssion cookie
	c, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	sessionToken := c.Value

	// check if this session token exists in database
	exists, dbUser := ValidToken(sessionToken)
	if !exists {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// check if session is expired
	if dbUser.Expiry.Before(time.Now()) {
		// delete session
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// session is valid, create new token
	newSessionToken := uuid.New().String()
	expiresAt := time.Now().Add(120 * time.Second)

	user.Expiry = expiresAt
	user.Session_Token = newSessionToken

	// set client cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   newSessionToken,
		Expires: expiresAt,
	})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)

	// get sesssion cookie
	c, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	sessionToken := c.Value
}

// ** GET FUNCTIONS ** //
func GetUserByName(w http.ResponseWriter, r *http.Request) {
	userName := mux.Vars(r)["username"]
	if !CheckIfUserNameExists(userName) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("User Not Found! (NAME)")
		return
	}
	var user entities.User
	database.Instance.First(&user, userName)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func QueryHandler(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Got parameter username:%s!\n", queryParams["username"][0])
	fmt.Fprintf(w, "Got parameter password:%s!", queryParams["password"][0])
}

func GetUserById(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	if !CheckIfUserIdExists(userId) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("User Not Found!")
		return
	}
	var user entities.User
	database.Instance.First(&user, userId)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []entities.User
	database.Instance.Find(&users)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

// ** UPDATE FUNCTION ** //
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	if !CheckIfUserIdExists(userId) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("User Not Found!")
		return
	}
	var user entities.User
	database.Instance.First(&user, userId)
	json.NewDecoder(r.Body).Decode(&user)
	database.Instance.Save(&user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// ** DELETE FUNCTION ** //
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userId := mux.Vars(r)["id"]
	if !CheckIfUserIdExists(userId) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("User Not Found!")
		return
	}
	var user entities.User
	database.Instance.Delete(&user, userId)
	json.NewEncoder(w).Encode("User Deleted Successfully!")
}
