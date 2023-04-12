package entities

type User struct {
	ID                             uint   `json:"id"`
	Username                       string `json:"username"`
	Name                           string `json:"name"`
	Password                       string `json:"password"`
	Expiry                         string `json:"expiry"`
	Session_Token                  string `json:"session_token"`
	Biography                      string `json:"biography"`
	Birthday                       string `json:"birthday"`
	Email                          string `json:"email"`
	Phone                          string `json:"phone"`
	Gender                         string `json:"gender"`
	Address_1                      string `json:"address_1"`
	Address_2                      string `json:"address_2"`
	Address_3                      string `json:"address_3"`
	Country                        string `json:"country"`
	Emergency_contact_name         string `json:"emergency_contact_name"`
	Emergency_contact_phone_number string `json:"emergency_contact_phone_number"`
	Emergency_contact_address      string `json:"emergency_contact_address"`
	ProfileImage                   string `json:"profile_image"`
	Status                         string `json:"status"`
}

type Listing struct {
	ID           uint   `json:"id"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	HostName     string `json:"host_name"`
	HostUsername string `json:"host_username"`
	HostEmail    string `json:"host_email"`
	HostAddress  string `json:"host_address"`
	// I included all of the user data because I feel like that would be super inefficient to not have them
	// readily available for front end to access; they wanted all listings, so let's just provide them to frontend
	GuestUsername1 string `json:"guest_username_1"`
	GuestUsername2 string `json:"guest_username_2"`
	GuestUsername3 string `json:"guest_username_3"`
	GuestUsername4 string `json:"guest_username_4"`
	// user info can be accessed later
	Capacity uint   `json:"capacity"`
	Status   string `json:"status"`
}

type UserForSearches struct {
	Username                   string      `json:"username"`
	Biography                  string      `json:"biography"`
	Birthday                   string      `json:"birthday"`
	Email                      string      `json:"email"`
	Phone                      string      `json:"phone"`
	Gender                     string      `json:"gender"`
	Address_1                  string      `json:"address_1"`
	Country                    string      `json:"country"`
	Distance_from_target_miles float64     `json:"distance_from_target_miles"`
	Distance_from_target_km    float64     `json:"distance_from_target_km"`
	NumberSharedTags           uint        `json:"count"`
	SharedTags                 []SharedTag `json:"shared_tags"`
}

type Connection struct {
	ID       uint   `json:"id"`
	Reciever string `json:"reciever"`
	Status   string `json:"status"`
	Sender   string `json:"sender"`
}

type RawTag struct {
	RawTag string `json:"raw_tag"`
}

type Tag struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	TagName  string `json:"tag_name"`
}

type CommonUsersPart struct {
	Username string `json:"username"`
	Count    uint   `json:"count"`
}

type CommonUsers struct {
	Username   string      `json:"username"`
	Count      uint        `json:"count"`
	SharedTags []SharedTag `json:"shared_tags"`
}

// only used in the test versions so I can demonstrate how it works; once we satisfied with how search works, will delete

type SharedTag struct {
	TagName string `json:"tag_name"`
}

type Admin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
