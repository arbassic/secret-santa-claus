import { Gift } from './gift';
import { Event } from './event';

export class UserMember {
  id: string;
  username: string;
  letter: string;
  gifts: Gift[];
  event: Event;
  token: string;
  get path() {
    return this.id + (this.token ? '/' + this.token : '');
  }
}