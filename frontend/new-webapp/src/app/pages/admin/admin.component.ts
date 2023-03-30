import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  users: User[] = [];

  constructor(public userHttp: UsersHttpService) {}

  ngOnInit() {
    this.onFetchUsers();
  }

  onFetchUsers(){
    this.userHttp.fetchUsers().subscribe({
      next : (data) => {
        console.log(data);
        this.users = data;
      },
      error : (err) => {
        console.log('Error fetching users');
        console.log(err);
      }
    })
  }

  onDeleteUser(userID: string){
    this.userHttp.deleteUser(userID).subscribe({
      next : (res) => {
        this.onFetchUsers();
      },
      error : (err) => {
        console.log(err);
      }
    })
  }
}
