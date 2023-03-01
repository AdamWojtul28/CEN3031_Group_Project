import { Component, ViewChild } from '@angular/core';
import { NgForm }  from '@angular/forms';

import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('f') loginForm!: NgForm;

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  userInfo: User = {
    username: '',
    password: '',
    email: '',
    bio: ''
  }

  constructor(private userHttp: UsersHttpService){}
  
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash"
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSubmitLogin(){
    console.log(this.loginForm);
    this.userInfo.username = this.loginForm.value.username;
    this.userInfo.password = this.loginForm.value.password;
    this.userHttp.loginUser(this.userInfo.username, this.userInfo.password).subscribe();
  }
}
