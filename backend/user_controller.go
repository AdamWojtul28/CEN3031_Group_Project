package main

import (
	"encoding/json"
	"fmt"
	"golang_angular/database"
	"golang_angular/entities"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

// ** Helper Functions ** //
func CurrentTimeFormatted() time.Time {
	currTimeStr := time.Now().Format("2006-01-02 15:04:05.0000")
	currTime, err := time.Parse("2006-01-02 15:04:05.0000", currTimeStr)
	if err != nil {
		panic(err)
	}
	return currTime
}

func CompareHashes(user entities.User) bool {
	userName := user.Username
	password := user.Password
	var dbUser entities.User
	result := database.Instance.Where("username = ?", userName).First(&dbUser)
	err := result.Scan(&dbUser)
	if err != nil {
		if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(password)); err != nil {
			// If the two passwords don't match, return false, then 401 where called
			return false
		}
	}
	return true
}

func QueryHandler(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Got parameter username:%s!\n", queryParams["username"][0])
	fmt.Fprintf(w, "Got parameter password:%s!", queryParams["password"][0])
}

func CheckSession(w http.ResponseWriter, r *http.Request) (time.Time, entities.User) {
	var emptyUser entities.User
	// get sesssion cookie
	c, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode("cookie not set")
			// Go's "zero date" which is 0001-01-01 00:00:00 +0000 UTC
			return time.Time{}, emptyUser
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return time.Time{}, emptyUser
	}
	sessionToken := c.Value
	// check if this session token exists in database
	exists, dbUser := ValidToken(sessionToken)
	if !exists {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode("token does not exist")
		return time.Time{}, emptyUser
	}

	// check if session is expired
	// convert db expiry entry (string) to a time.Time variable for comparison
	userTime, err := time.Parse("2006-01-02 15:04:05.0000", dbUser.Expiry)
	if err != nil {
		panic(err)
	}
	return userTime, dbUser
}

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

	// create new random session token
	sessionToken := uuid.New().String()
	expiresAt := time.Now().Add(120 * time.Second)
	// convert db expiry to string so it can be scanned later using
	user.Expiry = expiresAt.Format("2006-01-02 15:04:05.0000")
	user.Session_Token = sessionToken

	// set client cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   sessionToken,
		Expires: expiresAt,
	})

	// send information to the database (success)
	database.Instance.Create(&user)
	w.WriteHeader(202)
	// Code for 'Accepted' when unique username
	json.NewEncoder(w).Encode(user)
}

// ** CREATE LISTING ** //
func CreateListing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var listing entities.Listing
	json.NewDecoder(r.Body).Decode(&listing)

	// send information to the database (success)
	database.Instance.Create(&listing)
	w.WriteHeader(202)
	// Code for 'Accepted' when unique username
	json.NewEncoder(w).Encode(listing)
}

// ** CREATE RESERVATION ** //
func CreateReservation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var reservation entities.Reservation
	var overLappingReservations []entities.Reservation
	json.NewDecoder(r.Body).Decode(&reservation)
	database.Instance.Where("host_username = ? AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEEN ? AND ?))", reservation.HostUsername, reservation.StartDate, reservation.EndDate, reservation.StartDate, reservation.EndDate).Find(&overLappingReservations)
	if len(overLappingReservations) > 0 {
		w.WriteHeader(400)
		json.NewEncoder(w).Encode("Conflict with another reservation!")
	} else {
		// send information to the database (success)
		database.Instance.Create(&reservation)
		w.WriteHeader(202)
		// Code for 'Accepted' when unique username
		json.NewEncoder(w).Encode(reservation)
	}
}

/*
select dr1.* from date_ranges dr1
inner join date_ranges dr2
on dr2.start > dr1.start -- start after dr1 is started
  and dr2.start < dr1.end -- start before dr1 is finished


select name
from professors
where not exists (select *
				  from lectures
				  where pers-id = held_by);
*/

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

func ValidToken(token string) (bool, entities.User) {
	var user entities.User
	result := database.Instance.Where("session_token = ?", token).First(&user)
	err := result.Scan(&user)
	if err != nil {
		return true, user
	}
	return false, user
}

// ** AUTHENTICATION/QUERY FUNCTIONS ** //
func UserLoginAttempt(w http.ResponseWriter, r *http.Request) {
	var temporaryUser entities.User
	json.NewDecoder(r.Body).Decode(&temporaryUser)
	userName := temporaryUser.Username
	if !(CheckIfUserNameExists(userName)) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("No such username exists!")
		return
		// Checks if username does not exist
	}
	if !(CompareHashes(temporaryUser)) {
		w.WriteHeader(401)
		json.NewEncoder(w).Encode("Incorrect password!")
		return
		// Checks if username exists, but password is incorrect
	}

	// update user to db
	var user entities.User
	database.Instance.Where("username = ?", temporaryUser.Username).First(&user)
	json.NewDecoder(r.Body).Decode(&user)

	// create new random session token
	sessionToken := uuid.New().String()
	expiresAt := time.Now().Add(120 * time.Second)
	// convert db expiry to a string
	user.Expiry = expiresAt.Format("2006-01-02 15:04:05.0000")
	user.Session_Token = sessionToken

	// set client cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   sessionToken,
		Expires: expiresAt,
	})

	database.Instance.Save(&user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)

	w.WriteHeader(202)
	// Code for 'Accepted'
	json.NewEncoder(w).Encode("Proceed to page!")
	// Checks if username and password check out, from here, proceed to profile page
}

func Welcome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)

	userTime, dbUser := CheckSession(w, r)

	// if there is no error in CheckSession
	if (userTime != time.Time{}) {
		// delete session if session is expired
		if userTime.Before(CurrentTimeFormatted()) {
			dbUser.Session_Token = ""
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode("session expired")
			return
		}

		// if session is valid
		w.Write([]byte(fmt.Sprintf("Welcome %s!", user.Username)))
	}
}

func Refresh(w http.ResponseWriter, r *http.Request) {
	var temporaryUser entities.User
	json.NewDecoder(r.Body).Decode(&temporaryUser)

	userTime, dbUser := CheckSession(w, r)

	if (userTime != time.Time{}) {
		// update user to db
		var user entities.User
		database.Instance.Where("username = ?", temporaryUser.Username).First(&user)
		json.NewDecoder(r.Body).Decode(&user)

		// delete session if session is expired
		if userTime.Before(CurrentTimeFormatted()) {
			dbUser.Session_Token = ""
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode("session expired")
			return
		}

		// session is valid, create new token
		newSessionToken := uuid.New().String()
		expiresAt := time.Now().Add(120 * time.Second)

		// convert expiry to string so it can be scanned in db
		user.Expiry = expiresAt.Format("2006-01-02 15:04:05.0000")
		user.Session_Token = newSessionToken

		// set client cookie
		http.SetCookie(w, &http.Cookie{
			Name:    "session_token",
			Value:   newSessionToken,
			Expires: expiresAt,
		})

		database.Instance.Save(&user)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
		w.WriteHeader(202)
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)

	userTime, dbUser := CheckSession(w, r)

	// if there is no error in CheckSession
	if (userTime != time.Time{}) {
		// logout
		dbUser.Session_Token = ""
		// set client cookie
		http.SetCookie(w, &http.Cookie{
			Name:    "session_token",
			Value:   "",
			Expires: time.Now(),
		})

		w.WriteHeader(202)
		json.NewEncoder(w).Encode("User Logged Out!")
	}
}

// ** MATCHMAKING FUNCTIONS ** //
func Search(w http.ResponseWriter, r *http.Request) {
	var userSearchCondition entities.User
	json.NewDecoder(r.Body).Decode(&userSearchCondition)
	address_1 := userSearchCondition.Address_1
	// DARRION: Currently, this is just a duplicate of the GET ALL Endpoint, but I will be working on it
	var users []entities.User
	var userSearchInfo []entities.UserForSearches
	var blankSearchUser entities.UserForSearches
	database.Instance.Where("address_1 IS NOT NULL AND address_1 != ?", "").Find(&users)
	for i := 0; i < len(users); i++ {
		userSearchInfo = append(userSearchInfo, blankSearchUser)
		userSearchInfo[i].Username = users[i].Username
		userSearchInfo[i].Biography = users[i].Biography
		userSearchInfo[i].Birthday = users[i].Birthday
		userSearchInfo[i].Email = users[i].Email
		userSearchInfo[i].Phone = users[i].Phone
		userSearchInfo[i].Gender = users[i].Gender
		userSearchInfo[i].Address_1 = users[i].Address_1
		userSearchInfo[i].Country = users[i].Country
		userSearchInfo[i].Distance_from_target_miles, userSearchInfo[i].Distance_from_target_km = CalculateDistanceBetween(address_1, users[i].Address_1)
	}
	// Copies the user data into a struct that only contains relevant information (excludes password and other personal data)
	// Above also computes the distance of each user to target destination and stores that information in new struct

	sort.SliceStable(userSearchInfo, func(i, j int) bool {
		return userSearchInfo[i].Distance_from_target_miles < userSearchInfo[j].Distance_from_target_miles
	})
	// Sorts the users in the slice by how close they are to the target distination, with closest first and furthest last

	//for i := 0; i < len(users); i++ {
	//	fmt.Println(i, users[i].Address_1)
	//}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(userSearchInfo)
}

func FindUsersWithSearch(w http.ResponseWriter, r *http.Request) {
	location := r.URL.Query().Get("location")
	maxDistance := r.URL.Query().Get("maxDistance")
	unit := r.URL.Query().Get("unit")
	// First, create variables for the three units that will be considered in the search
	maxDistanceNumerical, err := strconv.ParseFloat(maxDistance, 64)
	// Convert maxDistance to a float64 for it can be compared distance generated by subsequent function
	if err != nil {
		fmt.Println(err)
	}
	var users []entities.User
	var userSearchInfo []entities.UserForSearches
	var blankSearchUser entities.UserForSearches
	database.Instance.Where("address_1 IS NOT NULL AND address_1 != ?", "").Find(&users)
	// Gets a list of all valid users
	for i := 0; i < len(users); i++ {
		distanceInMiles, distanceInKM := CalculateDistanceBetween(location, users[i].Address_1)
		if unit == "mi" {
			if distanceInMiles > maxDistanceNumerical {
				continue
			}
			// If an address is further than target destination, then not added to final list
		} else {
			if distanceInKM > maxDistanceNumerical {
				continue
			}
		}
		userSearchInfo = append(userSearchInfo, blankSearchUser)
		userSearchInfo[i].Username = users[i].Username
		userSearchInfo[i].Biography = users[i].Biography
		userSearchInfo[i].Birthday = users[i].Birthday
		userSearchInfo[i].Email = users[i].Email
		userSearchInfo[i].Phone = users[i].Phone
		userSearchInfo[i].Gender = users[i].Gender
		userSearchInfo[i].Address_1 = users[i].Address_1
		userSearchInfo[i].Country = users[i].Country
		userSearchInfo[i].Distance_from_target_miles, userSearchInfo[i].Distance_from_target_km = distanceInMiles, distanceInKM
	}
	sort.SliceStable(userSearchInfo, func(i, j int) bool {
		return userSearchInfo[i].Distance_from_target_miles < userSearchInfo[j].Distance_from_target_miles
	})
	// Sorts the users in the slice by how close they are to the target distination, with closest first and furthest last

	//for i := 0; i < len(users); i++ {
	//	fmt.Println(i, users[i].Address_1)
	//}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(userSearchInfo)
}

func TestSearch(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	password := r.URL.Query().Get("password")
	var users []entities.User
	database.Instance.Where("username = ? AND password = ?", username, password).Find(&users)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

func TestEscapeURLValues(w http.ResponseWriter, r *http.Request) {
	//location := r.URL.Query().Get("location")
	//fmt.Println(location)

	maxDistance := r.URL.Query().Get("maxDistance")
	maxDistanceNumerical, err := strconv.ParseFloat(maxDistance, 64)
	fmt.Println(maxDistanceNumerical)
	if err != nil {
		fmt.Println(err)
	}

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
