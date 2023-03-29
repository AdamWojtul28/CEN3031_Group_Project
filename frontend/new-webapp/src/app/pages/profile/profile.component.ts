import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  userLoggedIn: User;

  constructor(private route: ActivatedRoute, private usersService: UsersHttpService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      //this.username = params['username'];
    })

    this.userLoggedIn = this.usersService.userSnapshot;
  }

  onLogout() {
    this.usersService.logoutUser();
  }

}
