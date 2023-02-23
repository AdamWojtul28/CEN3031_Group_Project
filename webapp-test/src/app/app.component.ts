import { Component, OnInit } from '@angular/core';
import { UsersHttpService } from './users-http.service';

export interface User {
  username: string;
  password: string;
  id?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  users: User[] = [];
  fetchError = '';
  
  constructor(private userHttp: UsersHttpService) {}

  ngOnInit() {
    //this.onFetchUsers();
  }

  onCreateUser(userData: User) {
    this.userHttp.createNewUser(userData.username, userData.password)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (e) => console.log(e)
      });
  }

  onDeleteUser(userId: number = -1) {
    if (userId == -1) return;
    this.userHttp.deleteUser(userId)
      .subscribe({
        next: () => {
          this.onFetchUsers();
        }
      })
  }

  onFetchUsers() {
    this.userHttp.fetchUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (e) => {
          this.fetchError = e;
        }
      })
  }
}
