import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }
}
