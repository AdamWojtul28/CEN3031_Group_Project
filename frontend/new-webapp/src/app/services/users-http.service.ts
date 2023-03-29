import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseData, User } from "../models/user.model";
import { LoginUserInfo } from "../models/user.model";

import { map } from 'rxjs/operators';
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";

//https://worldier-testing-default-rtdb.firebaseio.com/users.

@Injectable({providedIn: 'root'})
export class UsersHttpService {
  userSnapshot: User;
  user = new Subject<User>();

  constructor(private http: HttpClient) {}

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
}