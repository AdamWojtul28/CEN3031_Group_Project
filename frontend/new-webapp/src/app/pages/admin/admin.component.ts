import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  pendingUsers: User[] = [];
  acceptedUsers: User[] = [];
  deniedUsers: User[] = [];
  bannedUsers: User[] = [];

  constructor(public userHttp: UsersHttpService) {}

  ngOnInit() {
    this.onFetchUsers();
  }

  onFetchUsers(){
    this.pendingUsers = [];
    this.acceptedUsers = [];
    this.deniedUsers = [];
    this.bannedUsers = [];

    this.userHttp.fetchUsers().subscribe({
      next : (res : User[]) => {
        for (let i = 0; i < res.length; i++) {
          switch (res[i].status) {
            case 'Pending': this.pendingUsers.push(res[i]); break;
            case 'Accepted': this.acceptedUsers.push(res[i]); break;
            case 'Denied': this.deniedUsers.push(res[i]); break;
            case 'Banned': this.bannedUsers.push(res[i]); break;
            default: console.log('You got a problem');
          }
        }
      },
      error : (err) => {
        console.log('Error fetching users');
        console.log(err);
      }
    })
  }

  onDeleteUser(userID: string){
    this.userHttp.deleteUser(userID).subscribe({
      next : ( ) => { this.onFetchUsers() },
      error : (err) => { console.log(err) }
    })
  }

  onDenyUser(username: string) {
    this.userHttp.denyUser(username).subscribe({
      next : ( ) => { this.onFetchUsers() },
      error : (err) => { console.log(err) }
    })
  }

  onAcceptUser(username: string) {
    this.userHttp.acceptUser(username).subscribe({
      next : ( ) => { this.onFetchUsers() },
      error : (err) => { console.log(err) }
    })
  }

  onBanUser(username: string) {
    this.userHttp.banUser(username).subscribe({
      next : ( ) => { this.onFetchUsers() },
      error : (err) => { console.log(err) }
    })
  }
}
