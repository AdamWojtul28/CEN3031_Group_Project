package main

import (
	"encoding/json"
	"fmt"
	"golang_angular/database"
	"golang_angular/entities"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"golang.org/x/crypto/bcrypt"
)

// /////////////////////////////////// ** Helper Functions ** ///////////////////////////////////////
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

func UpdateDbUser(w http.ResponseWriter, r *http.Request, user entities.User) {
	database.Instance.Save(&user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
	w.WriteHeader(202)
}

func RegisterUser(w http.ResponseWriter, r *http.Request, status string) {
	var tmpUser entities.User
	json.NewDecoder(r.Body).Decode(&tmpUser)
	if !CheckIfUserNameExists(tmpUser.Username) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("No such username exists")
		return
	}
	// double check that logged in user is an admin
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
		if !CheckIfAdmin(dbUser) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode("Not an admin")
			return
		}

		var user entities.User
		database.Instance.Where("username = ?", tmpUser.Username).First(&user)
		json.NewDecoder(r.Body).Decode(&user)
		user.Status = status

		UpdateDbUser(w, r, user)
	}
}

// ///////////////////////////////////// ** Check Functions ** ///////////////////////////////////////
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

func CheckIfConnectionExists(sender string, reciever string) (bool, entities.Connection) {
	var connection entities.Connection
	result := database.Instance.Where("sender = ? AND reciever = ?", sender, reciever).First(&connection)
	err := result.Scan(&connection)
	if err != nil {
		if connection.Sender == sender && connection.Reciever == reciever {
			return true, connection
		}
	}
	return false, connection
}

func CheckIfAdmin(dbUser entities.User) bool {
	var admin entities.Admin
	result := database.Instance.Where("username = ? AND password = ?", dbUser.Username, dbUser.Password).First(&admin)
	err := result.Scan(&admin)
	if err != nil {
		if admin.Username == dbUser.Username && admin.Password == dbUser.Password {
			return true
		}
	}
	return false
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

// ///////////////////////////////////// ** Basic User Functions ** ///////////////////////////////////////
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
	user.Status = "Pending"

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

func GetUsers(w http.ResponseWriter, r *http.Request) {
	// either get all users, or search for a username (using ?username=example username)
	username := r.URL.Query().Get("username")
	if username != "" {
		var user entities.User
		database.Instance.Where("username = ?", username).Find(&user)
		if user.Username != "" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(user)
		} else {
			w.WriteHeader(204)
		}

	} else {
		var users []entities.User
		database.Instance.Find(&users)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(users)
	}
}

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
	UpdateDbUser(w, r, user)
}

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
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("User Deleted Successfully!")
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

// ///////////////////////////////////// ** Basic Page Route Functions ** ///////////////////////////////////////
func Login(w http.ResponseWriter, r *http.Request) {
	var temporaryUser entities.User
	json.NewDecoder(r.Body).Decode(&temporaryUser)
	userName := temporaryUser.Username
	if !(CheckIfUserNameExists(userName)) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("No such username exists")
		return
		// Checks if username does not exist
	}
	if !(CompareHashes(temporaryUser)) {
		w.WriteHeader(401)
		json.NewEncoder(w).Encode("Incorrect password")
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
	UpdateDbUser(w, r, user)
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
		UpdateDbUser(w, r, user)
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

/////////////////////////////////////// ** Listing Functions ** ///////////////////////////////////////
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
func CreateListing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var listing entities.Listing
	var overlappingListing []entities.Listing
	json.NewDecoder(r.Body).Decode(&listing)
	database.Instance.Where("host_username = ? AND ((start_date BETWEEN ? AND ?) OR (end_date BETWEE N ? AND ?))", listing.HostUsername, listing.StartDate, listing.EndDate, listing.StartDate, listing.EndDate).Find(&overlappingListing)
	// ensures that a host does not create a listing for a time frame where they already have a listing posted
	if len(overlappingListing) > 0 {
		w.WriteHeader(400)
		json.NewEncoder(w).Encode("Conflict with another reservation!")
	} else {
		// send information to the database (success)
		database.Instance.Create(&listing)
		w.WriteHeader(202)
		// Code for 'Accepted' when unique username
		json.NewEncoder(w).Encode(listing)
	}
}

func UpdateTags(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	var TagsToUpdate entities.TagsToUpdate
	json.NewDecoder(r.Body).Decode(&TagsToUpdate)
	//fmt.Println(rawTag)

	var tagsToAdd []entities.Tag
	var addQueryResults []entities.Tag
	var tagToAdd entities.Tag
	tagsToAddStrings := strings.Split(TagsToUpdate.TagsToAdd, ",")
	//fmt.Println(tagsToAddStrings)

	for i := 0; i < len(tagsToAddStrings); i++ {
		if tagsToAddStrings[i] == "" {
			continue
		}
		database.Instance.Where("username = ? AND tag_name = ?", username, tagsToAddStrings[i]).Find(&addQueryResults)
		if len(addQueryResults) == 0 {
			tagToAdd.Username = username
			tagToAdd.TagName = tagsToAddStrings[i]
			tagsToAdd = append(tagsToAdd, tagToAdd)
		}
		addQueryResults = nil
	}

	var tagsToRemove []entities.Tag
	var removeQueryResults []entities.Tag
	var tagToDelete entities.Tag
	tagsToRemoveStrings := strings.Split(TagsToUpdate.TagsToRemove, ",")
	//fmt.Println(tagsToAddStrings)

	for i := 0; i < len(tagsToRemoveStrings); i++ {
		if tagsToRemoveStrings[i] == "" {
			continue
		}
		database.Instance.Where("username = ? AND tag_name = ?", username, tagsToRemoveStrings[i]).Find(&removeQueryResults)
		if len(removeQueryResults) != 0 {
			tagToDelete.Username = username
			tagToDelete.TagName = tagsToRemoveStrings[i]
			tagsToRemove = append(tagsToRemove, tagToDelete)
		}
		removeQueryResults = nil
	}
	// ensures that a host does not create a listing for a time frame where they already have a listing posted
	var updated bool
	updated = false
	if len(tagsToAdd) > 0 {
		// send information to the database (success)
		database.Instance.Create(&tagsToAdd)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tagsToAdd)
		updated = true
	}
	if len(tagsToRemove) > 0 {
		// send information to the database (success)
		var currentTag entities.Tag
		for i := 0; i < len(tagsToRemove); i++ {
			database.Instance.Where("username = ? AND tag_name = ?", tagsToRemove[i].Username, tagsToRemove[i].TagName).Delete(&currentTag)
		}
		// Deletes all tags with the desired attributes
		updated = true
	}
	if updated {
		w.WriteHeader(202)
	} else {
		w.WriteHeader(400)
	}
}

func GetTags(w http.ResponseWriter, r *http.Request) {
	// either get all users, or search for a username (using ?username=example username)
	username := r.URL.Query().Get("username")
	if username != "" {
		var tags []entities.Tag
		database.Instance.Where("username = ?", username).Find(&tags)
		if len(tags) > 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(tags)
		} else {
			w.WriteHeader(204)
		}
	} else {
		var tags []entities.User
		database.Instance.Find(&tags)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(tags)
	}
}

func AddTags(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	var rawTag entities.RawTag
	json.NewDecoder(r.Body).Decode(&rawTag)
	//fmt.Println(rawTag)

	var tagsToAdd []entities.Tag
	var queryResults []entities.Tag
	var tagToAdd entities.Tag
	tagsToAddStrings := strings.Split(rawTag.RawTag, ",")
	//fmt.Println(tagsToAddStrings)

	for i := 0; i < len(tagsToAddStrings); i++ {
		if tagsToAddStrings[i] == "" {
			continue
		}
		database.Instance.Where("username = ? AND tag_name = ?", username, tagsToAddStrings[i]).Find(&queryResults)
		if len(queryResults) == 0 {
			tagToAdd.Username = username
			tagToAdd.TagName = tagsToAddStrings[i]
			tagsToAdd = append(tagsToAdd, tagToAdd)
		}
		queryResults = nil
	}
	// ensures that a host does not create a listing for a time frame where they already have a listing posted
	w.Header().Set("Content-Type", "application/json")
	if len(tagsToAdd) == 0 {
		w.WriteHeader(400)
		json.NewEncoder(w).Encode("No tags added")
	} else {
		// send information to the database (success)
		database.Instance.Create(&tagsToAdd)
		w.WriteHeader(202)
		// Code for 'Accepted' when unique username
		json.NewEncoder(w).Encode(tagsToAdd)
	}
}

func DeleteTags(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	var rawTag entities.RawTag
	json.NewDecoder(r.Body).Decode(&rawTag)
	//fmt.Println(rawTag)

	var tagsToRemove []entities.Tag
	var queryResults []entities.Tag
	var tagToDelete entities.Tag
	tagsToRemoveStrings := strings.Split(rawTag.RawTag, ",")
	//fmt.Println(tagsToAddStrings)

	for i := 0; i < len(tagsToRemoveStrings); i++ {
		if tagsToRemoveStrings[i] == "" {
			continue
		}
		database.Instance.Where("username = ? AND tag_name = ?", username, tagsToRemoveStrings[i]).Find(&queryResults)
		if len(queryResults) != 0 {
			tagToDelete.Username = username
			tagToDelete.TagName = tagsToRemoveStrings[i]
			tagsToRemove = append(tagsToRemove, tagToDelete)
		}
		queryResults = nil
	}
	// ensures that a host does not create a listing for a time frame where they already have a listing posted
	w.Header().Set("Content-Type", "application/json")
	if len(tagsToRemove) == 0 {
		w.WriteHeader(400)
		json.NewEncoder(w).Encode("No tags removed")
	} else {
		// send information to the database (success)
		var currentTag entities.Tag
		for i := 0; i < len(tagsToRemove); i++ {
			database.Instance.Where("username = ? AND tag_name = ?", tagsToRemove[i].Username, tagsToRemove[i].TagName).Delete(&currentTag)
		}
		// Deletes all tags with the desired attributes
		w.WriteHeader(202)
		// Code for 'Accepted' when unique username
		json.NewEncoder(w).Encode("Tags deleted successfully")
	}
}

// ///////////////////////////////////// ** Matchmaking Functions ** ///////////////////////////////////////
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
	username := r.URL.Query().Get("username")
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
	fmt.Println(len(userSearchInfo))
	database.Instance.Where("username != ? AND address_1 IS NOT NULL AND address_1 != ?", username, "").Find(&users)
	// Gets a list of all valid users

	for i := 0; i < len(users); i++ {
		distanceInMiles, distanceInKM := CalculateDistanceBetween(location, users[i].Address_1)
		fmt.Println(distanceInMiles, distanceInKM)
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

	var similarUserInfo entities.CommonUsersPart
	var sharedTags []entities.SharedTag
	var emptyTag entities.SharedTag
	// temporary variables used to assign all parts of the userSearchInfo information as related to tags

	for i := 0; i < len(userSearchInfo); i++ {
		database.Instance.Raw(`SELECT tag2.username, COUNT(tag2.tag_name) AS count
							   FROM tags AS tag1, tags AS tag2
							   WHERE tag1.username = ? 
							   		 AND tag2.username = ?
							   		 AND tag1.username != tag2.username 
							   		 AND tag1.tag_name = tag2.tag_name
							   GROUP BY tag2.username`, username, userSearchInfo[i].Username).Scan(&similarUserInfo)
		userSearchInfo[i].NumberSharedTags = similarUserInfo.Count
		// Provides the number of shared tags between the user (provided in the URL) shares with each corresponding user close to their searched location

		database.Instance.Raw(`SELECT tag2.tag_name
						  FROM tags AS tag1, tags AS tag2
						  WHERE tag1.username = ? 
								AND tag2.username = ? 
								AND tag1.username != tag2.username 
								AND tag1.tag_name = tag2.tag_name`, username, similarUserInfo.Username).Scan(&sharedTags)
		// Lists the tags that the user (provided in the URL) shares with each corresponding user close to their searched location
		for j := 0; j < len(sharedTags); j++ {
			userSearchInfo[i].SharedTags = append(userSearchInfo[i].SharedTags, emptyTag)
			userSearchInfo[i].SharedTags[j].TagName = sharedTags[j].TagName
		}
		// Adds all of the tags shared by the users from the temporary sharedTags slice to the userSearchInfo.SharedTags slice
		// FOR ALEX => If I need to sort these in alphabetical order, please let me know
	}

	if len(userSearchInfo) > 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		// Returns a 200, OK, response, if the query goes through and users exist that match the query in the URL
		json.NewEncoder(w).Encode(userSearchInfo)
		// Provides a sorted list of users along with their distance away from the area provided in the URL
	} else {
		w.WriteHeader(204)
		// Returns a 204, No Content, response, if the query goes through but no users exist that match the query
	}
}

func TestSameTags(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	//var users []entities.User
	var similarUsers []entities.CommonUsers
	var sharedTags []entities.SharedTag
	database.Instance.Raw(`SELECT tag2.username, COUNT(tag2.tag_name) AS count
						   FROM tags AS tag1, tags AS tag2
						   WHERE tag1.username = ? 
						   		 AND tag1.username != tag2.username 
						   		 AND tag1.tag_name = tag2.tag_name
						   GROUP BY tag2.username`, username).Scan(&similarUsers)
	database.Instance.Raw(`SELECT tag2.username, tag2.tag_name
						   FROM tags AS tag1, tags AS tag2
						   WHERE tag1.username = ? 
						         AND tag1.username != tag2.username 
								 AND tag1.tag_name = tag2.tag_name`, username).Scan(&sharedTags)
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(similarUsers)
	json.NewEncoder(w).Encode(sharedTags)
}

func TestSameTagsOther(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	//var users []entities.User
	var temporaryCommonUser entities.CommonUsers
	var similarUsers []entities.CommonUsers
	var similarUserInfo []entities.CommonUsersPart
	var sharedTags []entities.SharedTag
	var emptyTag entities.SharedTag
	database.Instance.Raw(`SELECT tag2.username, COUNT(tag2.tag_name) AS count
						   FROM tags AS tag1, tags AS tag2
						   WHERE tag1.username = ? 
						   		 AND tag1.username != tag2.username 
						   		 AND tag1.tag_name = tag2.tag_name
						   GROUP BY tag2.username`, username).Scan(&similarUserInfo)
	for i := 0; i < len(similarUserInfo); i++ {
		similarUsers = append(similarUsers, temporaryCommonUser)
		database.Instance.Raw(`SELECT tag2.tag_name
						   FROM tags AS tag1, tags AS tag2
						   WHERE tag1.username = ? 
						   		 AND tag2.username = ? 
						         AND tag1.username != tag2.username 
								 AND tag1.tag_name = tag2.tag_name`, username, similarUserInfo[0].Username).Scan(&sharedTags)
		similarUsers[i].Username = similarUserInfo[i].Username
		similarUsers[i].Count = similarUserInfo[i].Count
		for j := 0; j < len(sharedTags); j++ {
			similarUsers[i].SharedTags = append(similarUsers[i].SharedTags, emptyTag)
			similarUsers[i].SharedTags[j].TagName = sharedTags[j].TagName
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(similarUsers)
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

// ///////////////////////////////////// ** Friend Functions ** ///////////////////////////////////////
func SendFriendRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var connection entities.Connection
	json.NewDecoder(r.Body).Decode(&connection)
	// check if either combination of connection exists
	res1, _ := CheckIfConnectionExists(connection.Sender, connection.Reciever)
	res2, _ := CheckIfConnectionExists(connection.Reciever, connection.Sender)
	if res1 || res2 {
		w.WriteHeader(409)
		json.NewEncoder(w).Encode("Connection already exists")
		return
	}
	connection.Status = "Pending"
	database.Instance.Create(&connection)
	w.WriteHeader(202)
	json.NewEncoder(w).Encode(connection)
}

func AcceptFriendRequest(w http.ResponseWriter, r *http.Request) {
	var tmpConnection entities.Connection
	json.NewDecoder(r.Body).Decode(&tmpConnection)
	result, dbConnection := CheckIfConnectionExists(tmpConnection.Sender, tmpConnection.Reciever)
	if !(result) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("Connection not found")
		return
	} else {
		dbConnection.Status = "Accepted"
		database.Instance.Save(&dbConnection)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(202)
		json.NewEncoder(w).Encode(dbConnection)
	}
}

func RemoveFriend(w http.ResponseWriter, r *http.Request) {
	var tmpConnection entities.Connection
	var dbConnection entities.Connection
	json.NewDecoder(r.Body).Decode(&tmpConnection)
	res1, dbConnection1 := CheckIfConnectionExists(tmpConnection.Sender, tmpConnection.Reciever)
	res2, dbConnection2 := CheckIfConnectionExists(tmpConnection.Reciever, tmpConnection.Sender)
	if !(res1 || res2) {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode("Connection not found")
		return
	} else if res1 {
		dbConnection = dbConnection1
	} else if res2 {
		dbConnection = dbConnection2
	}
	database.Instance.Delete(&dbConnection)
	json.NewEncoder(w).Encode("Connection deleted successfully")
}

func RetrieveFriends(w http.ResponseWriter, r *http.Request) {
	var user entities.User
	json.NewDecoder(r.Body).Decode(&user)
	var connections []entities.Connection
	//var friends []string

	// get a slice of connections where the user who is currently logged in is either the sender or the reciever
	database.Instance.Where("reciever = ? OR sender = ?", user.Username, user.Username).Find(&connections)
	// iterate through the slice of connections and add each username that is not the user logged in to the friends slice
	// for i := 0; i < len(connections); i++ {
	// 	if connections[i].Reciever != user.Username {
	// 		friends = append(friends, connections[i].Reciever)
	// 	}
	// 	if connections[i].Sender != user.Username {
	// 		friends = append(friends, connections[i].Sender)
	// 	}
	// }
	if len(connections) == 0 {
		w.WriteHeader(404)
		json.NewEncoder(w).Encode("No friends found")
		return
	}
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(connections)
}

// ///////////////////////////////////// ** Admin Functions ** ///////////////////////////////////////
func ValidAdmin(w http.ResponseWriter, r *http.Request) {
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

		// if session is valid, check that user is an admin
		if !CheckIfAdmin(dbUser) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode("Not an admin")
			return
		}
		w.WriteHeader(202)
		json.NewEncoder(w).Encode("Authorized admin")
	}
}

func AcceptUser(w http.ResponseWriter, r *http.Request) {
	RegisterUser(w, r, "Accepted")
}

func DenyUser(w http.ResponseWriter, r *http.Request) {
	RegisterUser(w, r, "Denied")
}

func BanUser(w http.ResponseWriter, r *http.Request) {
	RegisterUser(w, r, "Banned")
}

// ///////////////////////////////////// ** Websocket Functions ** ///////////////////////////////////////
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

const (
	// Time allowed to write a message to the peer.
	writeWait = 30 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

type Server struct {
	conns map[*websocket.Conn]string
}

func NewServer() *Server {
	return &Server{
		conns: make(map[*websocket.Conn]string),
	}
}

func (s *Server) handle(ws *websocket.Conn) {
	fmt.Println("New incoming connection from clinet:", ws.RemoteAddr())

	s.conns[ws] = "True"

	//s.readLoop(ws)
}

func (s *Server) readLoop(ws *websocket.Conn, sender string, receiver *string, message *string) {
	var currentConnection *websocket.Conn
	for connections, values := range s.conns {
		if values == sender {
			currentConnection = connections
			break
		}
		// looks through the map for the connection that involves the sender and reading that socket will give the right JSON
	}
	currentConnection.SetReadLimit(maxMessageSize)
	currentConnection.SetReadDeadline(time.Now().Add(pongWait))
	currentConnection.SetPongHandler(func(string) error { currentConnection.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		var dMData entities.DMData
		if err := currentConnection.ReadJSON(dMData); err != nil {
			fmt.Println(err)
			return
		}
		*receiver = dMData.Receiver
		*message = dMData.Message
		//messageType, p, err := ws.ReadMessage()
		//if err != nil {
		//	fmt.Println(err)
		//	return
		//}
		fmt.Println(message)
		// Add to the DB here
	}
}

func (s *Server) writeLoop(ws *websocket.Conn, sender string, receiver string, message string) {
	var currentConnection *websocket.Conn
	for connections, values := range s.conns {
		if receiver != "" && values == receiver {
			currentConnection = connections
			break
		}
		// looks through the map for the connection that involves the sender and reading that socket will give the right JSON
	}
	currentConnection.SetWriteDeadline(time.Now().Add(writeWait))
	for {
		if receiver != "" && message != "" {
			//if err := connections.WriteMessage(messageType, p); err != nil {
			//	fmt.Println(err)
			//	return
			//}
			var messageStruct entities.DirectMessage
			messageStruct.Message = message
			messageStruct.TimeSent = time.Now().String()
			messageStruct.Sender = sender
			if err := currentConnection.WriteJSON(messageStruct); err != nil {
				fmt.Println(err)
				return
			}
			receiver = ""
			message = ""
		}
	}
}

func webSocket(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("Client Successfully Connected...")
	reader(ws)
}

func reader(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println(string(p))
		// Add to the DB here

		if err := conn.WriteMessage(messageType, p); err != nil {
			fmt.Println(err)
			return
		}
	}
}
