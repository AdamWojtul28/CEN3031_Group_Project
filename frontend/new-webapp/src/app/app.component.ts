import { Component, OnInit } from '@angular/core';
import { UsersHttpService } from './services/users-http.service';
import { User } from './models/user.model';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'worldlier-webapp';

  constructor(private usersHttpService: UsersHttpService, private socketService: SocketService) {}

  ngOnInit() {
    this.usersHttpService.autoLogin();

    this.usersHttpService.user.subscribe({
      next: () => {
        this.socketService.onOpen();
      }
    })
  }
}
