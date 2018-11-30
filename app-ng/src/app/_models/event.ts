import { UserMember } from './user-member';


export class Event {
  id: String;
  name: String;
  namePrivate: String;
  createdDate: String;
  open: Boolean;
  cashAmount: Number;
  cashCurrency: String;
  members: UserMember[];
  results: [String, String][];
}