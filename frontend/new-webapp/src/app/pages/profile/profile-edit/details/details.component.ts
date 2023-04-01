import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{
  activeUser: User;
  isEditingInfo: boolean = false;

  inputValuesInfo = {
    newUsername: "Username",
    newPassword: "********",
    newEmail: "Email"
  }

  constructor(private userHttpService: UsersHttpService) {}

  ngOnInit() {

  }

  onClickEditInfo() {
    this.isEditingInfo = !this.isEditingInfo;
    this.inputValuesInfo.newUsername = "Username";
  }

  onSubmitChangesInfo() {
    console.log(this.inputValuesInfo.newUsername);
  }
}
