import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SearchData } from "../models/listing_search.model";


@Injectable({providedIn: 'root'})
export class ListingsHttpService {

  constructor(private http: HttpClient) {}

  searchListing(searchData: SearchData){
    console.log(encodeURIComponent(searchData.location));

    let searchURL = 'http://localhost:5000/api/search';
    searchURL += '?location=' + encodeURIComponent(searchData.location);
    searchURL += '&maxDistance=' + encodeURIComponent(searchData.max_distance);
    searchURL += '&unit=' + encodeURIComponent(searchData.unit);

    return this.http.get(searchURL)
  }

}