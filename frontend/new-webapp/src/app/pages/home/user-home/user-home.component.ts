import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Friendship, User } from 'src/app/models/user.model';
import { ImageService } from 'src/app/services/image.service';
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
  profileImages: Map<string, string> = new Map();

  location: string;
  
  constructor(private userHttpService: UsersHttpService, private imageService: ImageService, private router: Router) { }

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
          let friendName = '';
          if (friendship.status === "Accepted"){
            this.userFriends.push(friendship);
            friendName = (friendship.sender === this.userHttpService.user.value.username ? friendship.reciever : friendship.sender);
          }
          else if (friendship.sender != this.activeUser.username) {
            this.incomingFriends.push(friendship);
            friendName = friendship.sender;
          }
          else {
            this.outgoingFriends.push(friendship);
            friendName = friendship.reciever;
          }
          this.userHttpService.fetchUserByUsername(friendName).subscribe({
            next: (user: User) => {
              const path = this.imageService.loadImage(user.profile_image);
              this.profileImages.set(friendName, path);
            }
          })
        }
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

  onRemoveFriend(friend: Friendship){
    this.userHttpService.deleteFriend(friend.sender, friend.reciever).subscribe({
      next: (res) => {
        console.log(res);
        this.getFriends();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onLocationSearch(location: string) {
    console.log('Location:', location);
    this.location = location;
    // Pass the location to the map component to update the map center
  }

  chatWith(friend: string) {
    console.log('routting')
    this.router.navigate(['chat', friend]);
  }

  ngOnDestroy() {
    this.activeUserSub.unsubscribe();
  }
}
