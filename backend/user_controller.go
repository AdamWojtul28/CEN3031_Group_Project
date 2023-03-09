package main

import (
	"encoding/json"
	"fmt"
	"golang_angular/database"
	"golang_angular/entities"
	"net/http"

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

// ** AUTHENTICATION/QUERY FUNCTIONS ** //
func UserLoginAttempt(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)
	userName := user.Username
	password := user.Password
	if !(CheckIfUserNameExists(userName)) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("No such username exists!")
		return
		// Checks if username does not exist
	}
	if !(CheckIfExactUserExists(userName, password)) {
		w.WriteHeader(401)
		json.NewEncoder(w).Encode("Incorrect password!")
		return
		// Checks if username exists, but password is incorrect
	}
	w.WriteHeader(202)
	// Code for 'Accepted'
	json.NewEncoder(w).Encode("Proceed to page!")
	// Checks if username and password check out, from here, proceed to profile page
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
