import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  username: string = "";
  private userSub: Subscription;

  constructor(private usersService : UsersHttpService) { }

  ngOnInit() {
    this.userSub = this.usersService.user.subscribe(user => {
      if (user === null) {
        this.isAuthenticated = false;
      } 
      else{
        this.isAuthenticated = true;
        this.username = user.username;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
