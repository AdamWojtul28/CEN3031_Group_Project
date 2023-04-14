import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Friendship, ResponseData, User } from "../models/user.model";
import { LoginUserInfo } from "../models/user.model";

import { map, tap, take } from 'rxjs/operators';
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { UpdateProfileInfoModel } from "../models/http-formatting.model";

//https://worldier-testing-default-rtdb.firebaseio.com/users.

@Injectable({providedIn: 'root'})
export class UsersHttpService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

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
          res.profile_image,
          res.session_token, 
          res.expiry);
        this.user.next(user);
        this.autoLogout(user.tokenExpiration);
        localStorage.setItem('userData', JSON.stringify(user));
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
          res.profile_image,
          res.session_token, 
          res.expiry);
        this.user.next(user);
        this.autoLogout(user.tokenExpiration);
        localStorage.setItem('userData', JSON.stringify(user));
      }));
  }

  autoLogin() {
    const userData: {
      username: string,
      password: string,
      id: string,
      email: string,
      bio: string,
      profile_image: string,
      _token: string,
      _tokenExpiration: Date
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.username,
      userData.password,
      userData.id,
      userData.email,
      userData.bio,
      userData.profile_image,
      userData._token,
      userData._tokenExpiration);
    
    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogout(loadedUser.tokenExpiration);
    }
  }

  logoutUser() {
    this.user.next(null);
    this.router.navigate(['']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDate: Date) {
    var expirationDuration = new Date(expirationDate).getTime() - new Date().getTime();
    console.log(expirationDuration);
    //this.tokenExpirationTimer = setTimeout(() => {
    //  this.logoutUser();
    //}, expirationDuration);
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

  updateUserInfo(changes: UpdateProfileInfoModel) {
    return this.http.put<ResponseData>('http://localhost:5000/api/users/' + this.user.value.id, changes)
    .pipe(tap(res => {
      const user = new User(
        res.username, 
        res.password, 
        res.id, 
        res.email, 
        res.biography, 
        res.profile_image,
        res.session_token, 
        res.expiry);
      this.user.next(user);
      localStorage.setItem('userData', JSON.stringify(user));
    }));
  }

  // Requests Dealing with Friends

  getFriends(username: string) {
    const data = {username: username};
    return this.http.post<{[key: number] : Friendship}>('http://localhost:5000/api/retrieveFriends', data)
    .pipe(
      map(data => {
        const friendsArray : Friendship[] = [];
        for (const key in data) {
          friendsArray.push(data[key]);
        }
        return friendsArray;
      })
    )
  }

  sendFriendRequest(sender: string, receiver: string) {
    const data = {sender: sender, reciever: receiver};
    return this.http.post('http://localhost:5000/api/sendFriendRequest', data);
  }

  acceptFriendRequest(sender: string, receiver: string) {
    const data = {sender: sender, reciever: receiver};
    return this.http.post('http://localhost:5000/api/acceptFriendRequest', data);
  }

  deleteFriend(sender: string, receiver: string) {
    const data = {sender: sender, reciever: receiver};
    return this.http.post('http://localhost:5000/api/removeFriend', data);
  }
}