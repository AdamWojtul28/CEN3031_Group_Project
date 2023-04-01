import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  @ViewChild('f') profileForm!: NgForm;
  userViewed: User;

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  constructor(private route: ActivatedRoute, private usersService: UsersHttpService) { }

    ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params['username']);
      this.usersService.fetchUserByUsername(params['username'])
        .subscribe({
          next: (res) => {
            this.userViewed = res;
          },
          error: (err) => {
            console.log(err);
          }
        })
    })
  }

  onLogout() {
    this.usersService.logoutUser();
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSaveChanges() {
    console.log(NgForm);
  }

}
