import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "./app.component";

import { map } from 'rxjs/operators';

//https://worldier-testing-default-rtdb.firebaseio.com/users.

@Injectable({providedIn: 'root'})
export class UsersHttpService {
  constructor(private http: HttpClient) {}

  createNewUser(username: string, password: string) {
    const user: User = {username: username, password: password};
    return this.http.post('http://localhost:5000/api/users', user);
  }

  deleteUser(userId: number) {
    return this.http.delete('http://localhost:5000/api/users/' + userId);
  }

  fetchUsers() {
    return this.http
      .get<{[key: number] : User}>('http://localhost:5000/api/users')
        .pipe(
          map(data => {
            const postsArray : User[] = [];
            for (const key in data) {
              postsArray.push(data[key]);
            }
            return postsArray;
          })
        )
  }
}