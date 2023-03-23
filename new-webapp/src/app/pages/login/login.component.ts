import { Component, ViewChild } from '@angular/core';
import { NgForm }  from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('f') loginForm!: NgForm;
  userInfo: User = {
    username: '',
    password: '',
    email: '',
    bio: ''
  }
  errorMessage: string = '';

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  constructor(private userHttp: UsersHttpService, private router: Router){}
  
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash"
    this.isText ? this.type = "text" : this.type = "password";
  }

  resetError(){
    this.errorMessage = "";
  }

  onSubmitLogin(){
    this.userHttp.loginUser(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: (res) => {
          console.log(res);
          if (res === "Proceed to page!"){
            this.router.navigate(['users', this.loginForm.value.username]);
          }
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = err.error;
        }
      });
  }
}
