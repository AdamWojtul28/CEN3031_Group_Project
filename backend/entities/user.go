package entities

type User struct {
	ID                             uint   `json:"id"`
	Username                       string `json:"username"`
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
}

type Listing struct {
	ID           uint   `json:"id"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
	HostName     string `json:"host_name"`
	HostUsername string `json:"host_username"`
	HostEmail    string `json:"host_email"`
	HostAddress  string `json:"host_address"`
	HostCountry  string `json:"host_country"`
	Capacity     uint   `json:"capacity"`
	Status       string `json:"status"`
}

type Reservation struct {
	ID            uint   `json:"id"`
	StartDate     string `json:"start_date"`
	EndDate       string `json:"end_date"`
	GuestName     string `json:"guest_name"`
	GuestUsername string `json:"guest_username"`
	GuestEmail    string `json:"guest_email"`
	HostName      string `json:"host_name"`
	HostUsername  string `json:"host_username"`
	HostEmail     string `json:"host_email"`
	HostAddress   string `json:"host_address"`
	HostCountry   string `json:"host_country"`
	Status        string `json:"status"`
}

type UserForSearches struct {
	Username                   string  `json:"username"`
	Biography                  string  `json:"biography"`
	Birthday                   string  `json:"birthday"`
	Email                      string  `json:"email"`
	Phone                      string  `json:"phone"`
	Gender                     string  `json:"gender"`
	Address_1                  string  `json:"address_1"`
	Country                    string  `json:"country"`
	Distance_from_target_miles float64 `json:"distance_from_target_miles"`
	Distance_from_target_km    float64 `json:"distance_from_target_km"`
}

type UserConnection struct {
	ID     uint   `json:"id"`
	User1  string `json:"user1"`
	User2  string `json:"user2"`
	Status string `json:"status"`
	Sender string `json:"sender"`
}
