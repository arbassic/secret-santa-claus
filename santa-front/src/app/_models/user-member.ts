import { Gift } from './gift';
import { Event } from './event';

export class UserMember {
  id: String;
  username: String;
  letter: String;
  gifts: Gift[];
  event: Event;
}