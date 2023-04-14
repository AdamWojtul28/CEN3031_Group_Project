import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Friendship, User } from 'src/app/models/user.model';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit, OnDestroy{
  addFriendName: string = "";
  activeUser: User;
  activeUserSub: Subscription;
  warning: string = "";

  userFriends: Friendship[] = [];
  incomingFriends: Friendship[] = [];
  outgoingFriends: Friendship[] = [];
  
  constructor(private userHttpService: UsersHttpService) { }

  ngOnInit() {
    this.activeUserSub = this.userHttpService.user.subscribe({
      next: (value: User) => {
        this.activeUser = value;
        this.getFriends();
      }
    });  
  }

  getFriends() {
    this.userFriends = [];
    this.incomingFriends = [];
    this.outgoingFriends = [];
    this.userHttpService.getFriends(this.activeUser.username).subscribe({
      next: (res: Friendship[]) => {
        for (const friendship of res) {
          if (friendship.status === "Accepted"){
            this.userFriends.push(friendship);
          }
          else if (friendship.sender != this.activeUser.username) {
            this.incomingFriends.push(friendship);
          }
          else {
            this.outgoingFriends.push(friendship);
          }
        }
        console.log(this.userFriends);
        console.log(this.incomingFriends);
        console.log(this.outgoingFriends);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onAddFriend() {
    if (this.addFriendName.length === 0) return;
    if (this.addFriendName === this.activeUser.username) return;
    this.userHttpService.fetchUserByUsername(this.addFriendName).subscribe({

      next: (res) => {
        console.log(res);
        if (res === null) {
          this.warning = "User does not exist"
          return;
        }
        else {
          this.userHttpService.sendFriendRequest(this.activeUser.username, this.addFriendName).subscribe({
            next: (res) => {
              console.log(res);
              this.getFriends();
            },
            error: (err) => {
              console.log(err);
              if (err.status === 409) {
                this.warning = 'User is already on friends list'
              }
            }
          })
        }
      },

      error: (err) => {
        console.log(err);
      }
    })
  }

  onAcceptRequest(sender: string) {
    this.userHttpService.acceptFriendRequest(sender, this.activeUser.username).subscribe({
      next: (res) => {
        console.log(res);
        this.getFriends();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onDeclineRequest(sender: string) {
    this.userHttpService.deleteFriend(sender, this.activeUser.username).subscribe({
      next: (res) => {
        console.log(res);
        this.getFriends();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onUndoRequest(receiver: string) {
    this.userHttpService.deleteFriend(this.activeUser.username, receiver).subscribe({
      next: (res) => {
        console.log(res);
        this.getFriends();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnDestroy() {
    this.activeUserSub.unsubscribe();
  }
}
