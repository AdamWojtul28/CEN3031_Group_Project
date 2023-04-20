import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Friendship, ResponseData, User } from "../models/user.model";
import { LoginUserInfo } from "../models/user.model";

import { map, tap } from 'rxjs/operators';
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
          res.status,
          res.phone,
          res.address_1,
          res.address_2,
          res.address_3,
          res.country,
          res.birthday,
          res.gender,
          res.emergency_contact_address,
          res.emergency_contact_name,
          res.emergency_contact_phone_number,
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
          res.status,
          res.phone,
          res.address_1,
          res.address_2,
          res.address_3,
          res.country,
          res.birthday,
          res.gender,
          res.emergency_contact_address,
          res.emergency_contact_name,
          res.emergency_contact_phone_number,
          res.session_token, 
          res.expiry);
        this.user.next(user);
        this.autoLogout(user.tokenExpiration);
        localStorage.setItem('userData', JSON.stringify(user));
      }));
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
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
      userData.status,
      userData.phone,
      userData.address1,
      userData.address2,
      userData.address3,
      userData.country,
      userData.birthday,
      userData.gender,
      userData.emergency_contact_address,
      userData.emergency_contact_name,
      userData.emergency_contact_phone_number,
      userData._token,
      userData._tokenExpiration,);
    
    //if (loadedUser.token && new Date(loadedUser.tokenExpiration) > new Date()) {
      this.user.next(loadedUser);
      this.autoLogout(loadedUser.tokenExpiration);
    //}
  }

  refreshUser() {
    if (this.user.value === null || new Date(this.user.value.tokenExpiration).getTime() - new Date().getTime() > 110000) return;
    return;

    const data = {username: this.user.value.username, password: this.user.value.password}
    this.http.post<ResponseData>('http://localhost:5000/api/refresh', data).subscribe({
      next: (res: ResponseData) => {
        this.tokenExpirationTimer = null;
        const user = new User(
          res.username, 
          res.password, 
          res.id, 
          res.email, 
          res.biography, 
          res.profile_image,
          res.status,
          res.phone,
          res.address_1,
          res.address_2,
          res.address_3,
          res.country,
          res.birthday,
          res.gender,
          res.emergency_contact_address,
          res.emergency_contact_name,
          res.emergency_contact_phone_number,
          res.session_token, 
          res.expiry);
        this.user.next(user);
        this.autoLogout(user.tokenExpiration);
        localStorage.setItem('userData', JSON.stringify(user));
      },
      error: (err) => {
        console.log(err);
      }
    })
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
    // CHANGE THIS
    var expirationDuration = new Date(expirationDate).getTime() - new Date().getTime() + 10000000000000;
    console.log('Refresh: ' + expirationDuration / 1000 + 's');
    this.tokenExpirationTimer = null;
    this.tokenExpirationTimer = setTimeout(() => {
      this.logoutUser();
    }, expirationDuration);
  }

  deleteUser(userId: string) {
    return this.http.delete('http://localhost:5000/api/users/' + userId);
  }

  acceptUser(username: string) {
    let data = {username: username};
    return this.http.post('http://localhost:5000/api/acceptUser', data);
  }

  denyUser(username: string) {
    return this.http.post('http://localhost:5000/api/acceptUser', username);
  }

  banUser(username: string) {
    return this.http.post('http://localhost:5000/api/acceptUser', username);
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
        res.status,
        res.phone,
        res.address_1,
        res.address_2,
        res.address_3,
        res.country,
        res.birthday,
        res.gender,
        res.emergency_contact_address,
        res.emergency_contact_name,
        res.emergency_contact_phone_number,
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

  // Requests dealing with tags
  
  addTags(tags_to_add: string, tags_to_remove: string){
    const data = {tags_to_add: tags_to_add, tags_to_remove: tags_to_remove};
    let searchURL = 'http://localhost:5000/api/tags'
    searchURL += '?username=' + encodeURIComponent(this.user.value.username);

    return this.http.post(searchURL, data);
  }

  getTags(username: string = this.user.value.username){
    let searchURL = 'http://localhost:5000/api/tags'
    searchURL += '?username=' + encodeURIComponent(username);

    return this.http.get(searchURL);
  }

}