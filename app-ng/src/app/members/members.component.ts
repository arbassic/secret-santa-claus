import { Component, OnInit } from '@angular/core';
import { Member } from '@/model/member';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.styl']
})
export class MembersComponent implements OnInit {

  member: Member = {
    id: 7381,
    nick: 'Andrzejek',
    token: '8278a982bc92393e09201acf'
  };

  constructor() { }

  ngOnInit() {
  }

}
