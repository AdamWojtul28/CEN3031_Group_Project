import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SearchData } from 'src/app/models/listing_search.model';
import { ListingsHttpService } from 'src/app/services/listings-http.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  searchData: SearchData = {location: '', max_distance: 0, unit: ''};
  isSent: boolean = false;

  @Output() locationSearch = new EventEmitter<string>();

  constructor(public listingsHttpService: ListingsHttpService) {}

  onSubmit(form: NgForm){
    this.searchData.location = form.value.city;
    this.searchData.max_distance = form.value.distance;
    this.searchData.unit = form.value.unit;
    console.log(this.searchData);

    this.listingsHttpService.searchListing(this.searchData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.isSent = true;
        },
        error: (err) => {
          console.log(err);
        }
      })
    this.locationSearch.emit(form.value.city);
  }
}
