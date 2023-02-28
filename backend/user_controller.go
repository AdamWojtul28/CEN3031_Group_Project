package main

import (
	"encoding/json"
	"golang_angular/database"
	"golang_angular/entities"
	"net/http"

	"github.com/gorilla/mux"
)

// ** CREATE USER ** //
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	userName := user.Username
	if CheckIfUserNameExists(userName) {
		json.NewEncoder(w).Encode("Username is Taken!")
		return
	}
	json.NewDecoder(r.Body).Decode(&user)
	database.Instance.Create(&user)
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
	database.Instance.First(&user, userName)
	if user.Username == userName {
		return true
	}
	return false
}

// ** GET FUNCTIONS ** //
func GetUserByName(w http.ResponseWriter, r *http.Request) {
	userName := mux.Vars(r)["username"]
	if !CheckIfUserNameExists(userName) {
		json.NewEncoder(w).Encode("User Not Found! (NAME)")
		return
	}
	var user entities.User
	database.Instance.First(&user, userName)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func GetUserById(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["id"]
	if !CheckIfUserIdExists(userId) {
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
