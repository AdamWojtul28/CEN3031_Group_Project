import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UpdateProfileInfoModel } from 'src/app/models/http-formatting.model';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{
  @ViewChild('f') infoForm!: NgForm;

  activeUser= new User('alexander', 'sojhfksdjasdfiluhjkdsf', '12', 'alex@gmail.com',
    'There once was a person. That person is me.', 'sdfsdf', new Date());
  isEditingInfo: boolean = false;

  inputValuesInfo = {
    newUsername: "Username",
    newEmail: "Email",
    newPassword: "********"
  }

  constructor(private userHttpService: UsersHttpService) {}

  ngOnInit() {

  }

  onClickEditInfo() {
    if (this.isEditingInfo) {
      this.infoForm.resetForm();
    }

    this.isEditingInfo = !this.isEditingInfo;
    this.inputValuesInfo.newUsername = this.activeUser.username;
    this.inputValuesInfo.newEmail = this.activeUser.email;
    this.inputValuesInfo.newPassword = "";
  }

  onSubmitChangesInfo() {
    let changes: UpdateProfileInfoModel = {};
    if (this.activeUser.username != this.inputValuesInfo.newUsername) {
      changes.username = this.inputValuesInfo.newUsername;
    }
    if (this.activeUser.email != this.inputValuesInfo.newEmail) {
      changes.email = this.inputValuesInfo.newEmail;
    }
    if(this.infoForm.value.newpassword) {
      changes.password = this.infoForm.value.newpassword
    }
    console.log(changes);
  }
}
