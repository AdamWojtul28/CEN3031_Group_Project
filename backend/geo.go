package main

import (
	"github.com/codingsince1985/geo-golang"
	"github.com/codingsince1985/geo-golang/openstreetmap"

	"github.com/umahmood/haversine"
)

func FindLocation(latitude *float64, longitude *float64, addr string, geocoder geo.Geocoder) {
	location, _ := geocoder.Geocode(addr)
	// Uses the OpenStreetMap functionality to convert the string address into the location's corresponding latitude and longitude
	if location != nil {
		//fmt.Printf("%s location is (%.6f, %.6f)\n", addr, location.Lat, location.Lng) <- prints the address and its latitude + longitude
		*latitude = location.Lat
		*longitude = location.Lng
	} else {
		//fmt.Println("got <nil> location") <- indicates incorrect input
		*latitude = -1000
		*longitude = -1000
		// Since the latitude and longitude values cannot be -1000, this indicates an incorrect input
	}
	//fmt.Println("OpenStreetMap")
}

func CalculateDistanceBetween(city1 string, city2 string) (float64, float64) {
	var lat1 float64
	var long1 float64
	var lat2 float64
	var long2 float64

	FindLocation(&lat1, &long1, city1, openstreetmap.Geocoder())
	// Updates the first latitude/longitude pair
	FindLocation(&lat2, &long2, city2, openstreetmap.Geocoder())
	// Updates the second latitude/longitude pair

	if lat1 == -1000 || lat2 == -1000 {
		return -1, -1
	}
	// Since distance cannot be negative, if either of the latitude/longitude pairs are improper, (-1, -1) is returned

	locationOne := haversine.Coord{Lat: lat1, Lon: long1}
	locationTwo := haversine.Coord{Lat: lat2, Lon: long2}
	mi, km := haversine.Distance(locationOne, locationTwo)
	// The above lines take the two latitude/longitude pairs and use the Haversine formula on them to determine the distance between them
	//fmt.Println("Miles:", mi, "Kilometers:", km)
	return mi, km
}
