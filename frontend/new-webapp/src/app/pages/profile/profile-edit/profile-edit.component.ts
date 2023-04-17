import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit{
  user: User;
  section: string = 'details'

  constructor(private router: Router, private userHttpService: UsersHttpService) { }

  ngOnInit() {
    if (this.router.url === '/profile') {
      this.router.navigate(['profile/details']);
    }
    else {
      this.section = this.router.url.substring(9);
    }
  }

  onChooseSection(section: string) {
    this.section = section;
  }

  onLogout() {
    this.userHttpService.logoutUser();
  }
}