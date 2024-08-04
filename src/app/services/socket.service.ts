// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly apiUrl = 'https://sso-cf.tipeeestream.com:443';
  private readonly apiKey = '74646217c2070d5e4afed757ebd2aa6b9ea43553';

  constructor() {
    this.socket = io(this.apiUrl, {
      transports: ['websocket'],
      query: {
        access_token: this.apiKey
      }
    });
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
   
    });
  }
  joinRoom(username: string): void {
    this.socket.emit('join-room', { room: this.apiKey, username });
  }

  on(eventName: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(eventName, data => {
        observer.next(data);
      });
    });
    
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
