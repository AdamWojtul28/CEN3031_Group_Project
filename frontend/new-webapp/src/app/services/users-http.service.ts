import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData, User } from "../models/user.model";
import { LoginUserInfo } from "../models/user.model";

import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { UpdatePfpModel } from "../models/http-formatting.model";

//https://worldier-testing-default-rtdb.firebaseio.com/users.

@Injectable({providedIn: 'root'})
export class UsersHttpService {
  userSnapshot: User;
  user = new Subject<User>();

  constructor(private http: HttpClient, private router: Router) {}

  createNewUser(username: string, password: string, email: string) {
    const user: LoginUserInfo = {username: username, password: password, email: email};
    return this.http.post<ResponseData>('http://localhost:5000/api/users', user)
      .pipe(tap(res => {
        const user = new User(
          res.username, 
          res.password, 
          res.id, 
          res.email, 
          res.biography, 
          res.session_token, 
          res.expiry);
        this.user.next(user);
        this.userSnapshot = user;
      }));
  }

  loginUser(username: string, password: string) {
    const user: LoginUserInfo = {username: username, password: password, email: ''};
    return this.http.post<ResponseData>('http://localhost:5000/api/signin', user)
      .pipe(tap(res => {
        const user = new User(
          res.username, 
          res.password, 
          res.id, 
          res.email, 
          res.biography, 
          res.session_token, 
          res.expiry);
        this.user.next(user);
        this.userSnapshot = user;
      }));
  }

  logoutUser() {
    console.log('logigin out')
    this.user.next(null);
    this.router.navigate(['']);
  }

  deleteUser(userId: string) {
    return this.http.delete('http://localhost:5000/api/users/' + userId);
  }

  fetchUsers() {
    return this.http
      .get<{[key: number] : User}>('http://localhost:5000/api/users')
        .pipe(
          map(data => {
            const usersArray : User[] = [];
            for (const key in data) {
              usersArray.push(data[key]);
            }
            return usersArray;
          })
        )
  }

  fetchUserByUsername(username : string) {
    let searchURL = 'http://localhost:5000/api/users'
    searchURL += '?username=' + encodeURIComponent(username);
    return this.http.get<User>(searchURL);
  }

  updateUserInfo() {

  }

  updatePfp(image: string | ArrayBuffer) {
    const data: UpdatePfpModel = {image: image}
    return this.http.post<ResponseData>('http://localhost:5000/api/users', data);
  }
}