import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
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
  @ViewChild('p') pfpForm!: NgForm;

  //activeUser= new User('alexander', 'sojhfksdjasdfiluhjkdsf', '12', 'alex@gmail.com',
  //  'There once was a person. That person is me.', 'sdfsdf', new Date());

  isEditingInfo: boolean = false;
  isEditingPfp: boolean = false;

  inputValuesInfo = {
    newUsername: "Username",
    newEmail: "Email",
    newPassword: "********"
  }

  activeUser: User;
  imagePath: any;

  constructor(private userHttpService: UsersHttpService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.activeUser = this.userHttpService.userSnapshot
    this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.activeUser.profile_image)
  }

  onClickEditPfp() {
    if (this.isEditingPfp) {
      this.pfpForm.reset();
    }

    this.isEditingPfp = !this.isEditingPfp;
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

  onUploadPfp(event: Event) {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    console.log(file);

    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      const changes: UpdateProfileInfoModel = {profile_image: myReader.result}
      console.log(myReader.result);
      this.userHttpService.updateUserInfo(changes).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    myReader.readAsDataURL(file);
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

    this.userHttpService.updateUserInfo(changes).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
