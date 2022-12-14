import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

// back
import { UserService } from '../service/user.service';
import { ChatService } from '../service/chat.service';
import Room from '../Entity/Room.entity';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('item')itemsElement: QueryList<ElementRef>;

  newMessage: string;
  messagesList: any[] = [];
  rooms: Room[] = [];
  currentRoom: Room;
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private userService: UserService, private chatService: ChatService) {
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    if (!this.userService.getJwt()) {
      this.router.navigate(['/login']);
    } else {
      console.log("Linking to ws...");
      this.subscriptions.push(this.chatService.getNewMessage().subscribe((message: any) => {
        console.log(message);
        if (message.authorId === this.userService.getUser().userId) {
          this.messagesList.push({ ...message, ownedByMe: true });
        } else {
          this.messagesList.push({ ...message, ownedByMe: false });
        }
      }));
      this.subscriptions.push(this.chatService.listRooms(this.userService.getJwt()).subscribe({
        error: err => console.log(err),
        next: res => {
          console.log(res);
          res.forEach(r => {
            this.rooms.push({ chatId: r._id, name: r.title });
          });
        }
      }));
      this.subscriptions.push(this.chatService.getRoomInfo().subscribe({
        error: err => console.error(err),
        next: (res) => {
          this.currentRoom = res;
        }
      }))
      console.log("linked !");
    }
  }

  ngAfterViewInit() {
    this.itemsElement.changes.subscribe(res=>{
      setTimeout(()=>{
        res.last.nativeElement.focus()
      });
    });
  }

  logout() {
    this.userService.logout();
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage, this.userService.getJwt());
    this.newMessage = '';
  }

  joinRoom(id) {
    this.chatService.changeRoom(id, this.userService.getJwt());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
