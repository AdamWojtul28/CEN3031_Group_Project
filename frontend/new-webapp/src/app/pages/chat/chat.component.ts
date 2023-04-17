import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  chattingWith: string = '';
  friends: User[] = [];

  constructor(private usersHttpService: UsersHttpService) {}

  ngOnInit() {
    this.usersHttpService.getFriends(this.usersHttpService.user.value.username).subscribe({
      next: (friends) => {
        for (let friend of friends) {
          if (friend.status === 'Accepted') {
            const name: string = ((friend.reciever === this.usersHttpService.user.value.username) ? friend.sender : friend.reciever);
            this.usersHttpService.fetchUserByUsername(name).subscribe({
              next: (res) => {
                this.friends.push(res);
              },
              error: (err) => console.log(err)
            })
          }
        }
      }
    })
  }

  onChooseUser(username: string) {
    this.chattingWith = username;
  }
}
