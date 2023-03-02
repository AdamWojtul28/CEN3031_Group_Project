import { Component, ViewChild } from '@angular/core';
import { NgForm }  from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @ViewChild('f') loginForm!: NgForm;
  userInfo: User = {
    username: '',
    password: '',
    email: '',
    bio: ''
  }
  errorMessage="";

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  constructor(private userHttp: UsersHttpService, private router: Router) {}

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash"
    this.isText ? this.type = "text" : this.type = "password";
  }

  resetError(){
    this.errorMessage = "";
  }

  onSubmitCreateUser(){
    this.userHttp.createNewUser(this.loginForm.value.username, this.loginForm.value.password, this.loginForm.value.email)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res === "Username is Taken!"){
            this.errorMessage = "Username is Taken!";
          } else {
            this.router.navigate(['users', this.loginForm.value.username]);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
