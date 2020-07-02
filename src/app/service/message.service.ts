import { Injectable } from '@angular/core';

/* an in-momery log system */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}

  messages: string[] = [];

  /* push message into array */
  add(message: string): void {
    this.messages.push(message);
  }

  /* just clear all messages */
  clear(): void {
    this.messages = [];
  }

}
