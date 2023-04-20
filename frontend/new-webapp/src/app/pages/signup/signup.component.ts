import { Component, ViewChild } from '@angular/core';
import { NgForm }  from '@angular/forms';
import { Router } from '@angular/router';

import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @ViewChild('f') loginForm!: NgForm;
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
          // -------------------------
          console.log(res);
          this.router.navigate(['profile/details']);
        },
        error: (err) => {
          // -------------------------
          console.log(err);
          this.errorMessage = err.error;
        }
      });
  }
}
