import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "./app.component";

@Injectable({providedIn: 'root'})
export class UsersHttpService {
  constructor(private http: HttpClient) {}

  createNewUser(username: string, password: string) {
    const user: User = {username: username, password: password};
    return this.http.post('https://worldier-testing-default-rtdb.firebaseio.com/users.json', user);
  }

  deleteUsers(){
    return this.http.delete('https://worldier-testing-default-rtdb.firebaseio.com/post.json');
  }
}