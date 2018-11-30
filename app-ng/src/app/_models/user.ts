import { Event } from './event';

export class User {
  id: number;
  username: string;
  password: string;
  createdDate: string;
  token: string;
  type: string;
  events: Event[];

  get registered() { return this.type === 'registered'; };
  get nonregistered() { return this.type !== 'registered'; };
}