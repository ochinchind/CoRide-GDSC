import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

export interface Message {
  id: number, 
  initial_address: string,
  end_address: string,
  length_time: string, 
  length_metres: string, 
  client_id: string, 
  active: number
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public message?: Subject<Message>;

  constructor(private wsService: WebsocketService) {
    var url:any = 'ws://127.0.0.1:8000/ws';
    this.message = <Subject<Message>>wsService
    .connect(url)
    .pipe(map((response: MessageEvent): Message => {
      let data = JSON.parse(response.data);
      return {
        id: data.id, 
        initial_address: data.initial_address,
        end_address: data.end_address,
        length_time: data.length_time, 
        length_metres: data.length_metres, 
        client_id: data.client_id, 
        active: data.active
      }
    }));

   }
}
