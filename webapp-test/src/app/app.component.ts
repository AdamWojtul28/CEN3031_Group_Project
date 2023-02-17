import { Component, OnInit } from '@angular/core';
import { UsersHttpService } from './users-http.service';

export interface User {
  username: string;
  password: string;
  id?: string;
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
    this.onFetchUsers();
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

  onDeleteUsers() {
    this.userHttp.deleteUsers()
      .subscribe({
        next: () => {
          this.users = [];
        }
      })
  }

  onFetchUsers() {
    this.userHttp.fetchUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
          console.log(data);
        },
        error: (e) => {
          this.fetchError = e;
        }
      })
  }
}
