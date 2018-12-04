import { UserMember } from './user-member';


export class Event {
  id: string;
  name: string;
  namePrivate: string;
  createdDate: string;
  open: Boolean;
  cashAmount: Number;
  cashCurrency: string;
  members: UserMember[];
  results: [string, string][];
}