import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { io } from 'socket.io-client';

// config
import Config from './variables.config';
import Room from '../Entity/Room.entity';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    public message$: BehaviorSubject<any> = new BehaviorSubject('');
    private socket = io(`${Config.serverUrl}/${Config.chat.default}`);
    private roomInfo: Room = {
        name: Config.chat.defaultRoom.defaultName,
        chatId: Config.chat.defaultRoom.defaultChatId,
    };
    
    constructor(private http: HttpClient) {}

    private getInfo(chatId, jwt) {
        const gHeaders = new HttpHeaders({ 'Content-type': 'application/json', Authorization: `Bearer ${jwt}` });
        this.http.get<any>(`${Config.serverUrl}/${Config.chat.getInfo(chatId)}`, { headers: gHeaders }).subscribe({
            error: err => console.error(err),
            next: resp => {
                console.log(resp);
                this.roomInfo.name = resp.title;
                this.roomInfo.chatId = resp._id;
            }
        });
    }

    public getRoomInfo(): Observable<Room> {
        return new BehaviorSubject(this.roomInfo).asObservable();
    }

    public sendMessage(message: string, jwt: string) {
        this.socket.emit('message', { body: message, jwt, chatRoomId: this.roomInfo.chatId });
    }

    public getNewMessage = () => {
        this.socket.on('message', (message) => {
            this.message$.next(message);
        });

        return this.message$.asObservable();
    }

    public listRooms(jwt) {
        const gHeaders = new HttpHeaders({ 'Content-type': 'application/json', Authorization: `Bearer ${jwt}` });
        return this.http.get<any>(`${Config.serverUrl}/${Config.chat.getList}`, { headers: gHeaders });
    }

    public changeRoom(chatId, jwt) {
        const gHeaders = new HttpHeaders({ 'Content-Type': 'Application/json', Authorization: `Bearer ${jwt}` });
        this.http.get<any>(`${Config.serverUrl}/${Config.chat.joinChat(chatId)}`, { headers: gHeaders }).subscribe({
            error: err => console.error(err),
            next: () => {
                this.getInfo(chatId, jwt);
            }
        });
    }
};
