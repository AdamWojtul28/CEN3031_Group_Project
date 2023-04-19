import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { UsersHttpService } from "./users-http.service";


@Injectable({providedIn: 'root'})
export class SocketService{
  
  private isOpen: boolean = false;
  private socket: WebSocket;
  private listener: EventEmitter<any> = new EventEmitter();

  public constructor(private userHttpService: UsersHttpService) {}

  public onOpen() {
    if (this.isOpen) return;
    console.log('opening');
    this.socket = new WebSocket("ws://localhost:5000/ws/" + this.userHttpService.user.value.username);
    this.socket.onopen = event => {
      this.listener.emit({"type": "open", "data": event});
    }
    this.socket.onclose = event => {
      this.listener.emit({"type": "close", "data": event});
    }
    this.socket.onmessage = event => {
      this.listener.emit({"type": "message", "data": JSON.parse(event.data)});
    }
    this.isOpen = true;
  }

  public send(message: string, userID: string) {
    if (!this.isOpen) return;
    this.socket.send(JSON.stringify({
      EventName: 'message',
      EventPayload: {
        userId: userID,
        message: message
      }
    }));
  }

  public close() {
    if (!this.isOpen) return;
    this.socket.close();
  }

  public getEventListener() {
    if (!this.isOpen) return null;
    return this.listener;
  }

}