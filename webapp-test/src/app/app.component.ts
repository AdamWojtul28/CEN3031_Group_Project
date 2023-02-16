import { Component } from '@angular/core';
import { UsersHttpService } from './users-http.service';

export interface User {
  username: string;
  password: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private userHttp: UsersHttpService) {}

  onCreateUser(userData: User) {
    this.userHttp.createNewUser(userData.username, userData.password)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (e) => console.log(e)
      });
  }

  onDeleteUsers(){
    this.userHttp.deleteUsers()
      .subscribe(v => {
        console.log('deleted');
      })
  }
}
