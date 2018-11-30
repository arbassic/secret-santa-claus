import { Event } from './event';

export class User {
  id: String;
  username: String;
  password: String;
  createdDate: String;
  token: String;
  type: String;
  events: Event[];

  get registered() { return this.type === 'registered'; };
  get nonregistered() { return this.type !== 'registered'; };
}