import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit{
  mapCenter: google.maps.LatLngLiteral = { lat: -34.397, lng: 150.644 };
  zoom: number = 8;
  mapOptions: google.maps.MapOptions = {
    center: this.mapCenter,
    zoom: this.zoom,
  };

  @Input() location: string;

  private map: google.maps.Map;
  userPosition: google.maps.LatLngLiteral

  constructor() { }

  ngOnInit(){
    this.getUserLocation();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['location'] && changes['location'].currentValue) {
      this.updateMapCenter(changes['location'].currentValue);
    }
  }

  onMapReady(map: google.maps.Map) {
    this.map = map;
  }

  updateMapCenter(location: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK') {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        this.mapCenter = { lat, lng };
        this.mapOptions.center = this.mapCenter;
        this.map.setCenter(this.mapCenter);
      } else {
        console.error('Geocode error:', status);
      }
    });
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.userPosition = { lat, lng };
          this.updateMapCenter(`${lat},${lng}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
