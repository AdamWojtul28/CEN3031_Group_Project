import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateProfileInfoModel } from 'src/app/models/http-formatting.model';
import { User } from 'src/app/models/user.model';
import { ImageService } from 'src/app/services/image.service';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy{
  @ViewChild('f') infoForm!: NgForm;
  @ViewChild('p') pfpForm!: NgForm;
  @ViewChild('d') detailsForm!: NgForm;

  isEditingInfo: boolean = false;
  isEditingPfp: boolean = false;
  isEditingDetails: boolean = false;

  inputValuesInfo = {
    newUsername: "Username",
    newEmail: "Email",
    newPassword: "********"
  }

  inputValuesDetails = {
    newBio: "Bio"
  }

  activeUserSub: any;
  activeUser: User;
  imagePath: any = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  constructor(private userHttpService: UsersHttpService, private imageService: ImageService, private router: Router) {}

  ngOnInit() {
    this.activeUserSub = this.userHttpService.user.subscribe({
      next: (value: User) => {
        if(value === null){
          this.router.navigate(['/login'])
        }
        this.activeUser = value;
        if (this.activeUser.profile_image) {
          this.imagePath = this.imageService.loadImage(this.activeUser.profile_image);
          console.log(this.imagePath);
        }
      }
    });    
  }

  ngOnDestroy() {
    this.activeUserSub.unsubscribe();
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

  onClickEditDetails() {
    if (this.isEditingDetails) {
      this.detailsForm.resetForm();
    }

    this.isEditingDetails = !this.isEditingDetails;
    this.inputValuesDetails.newBio = this.activeUser.bio;
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
          this.isEditingPfp = false;
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
        this.isEditingInfo = false;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onSubmitChangesDetails() {
    let changes: UpdateProfileInfoModel = {};
    if (this.activeUser.bio != this.inputValuesDetails.newBio) {
      changes.biography = this.inputValuesDetails.newBio;
    }

    this.userHttpService.updateUserInfo(changes).subscribe({
      next: (res) => {
        this.isEditingDetails = false;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
