import { Component, OnInit } from '@angular/core';
import { UserService, AlertService } from '@/_services';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserMember } from '@/_models/user-member';
import { EventsService } from '@/_services/events.service';

@Component({
  selector: 'app-member-event',
  templateUrl: './member-event.component.html',
  styleUrls: ['./member-event.component.styl']
})
export class MemberEventComponent implements OnInit {

  userMember: UserMember;
  parentMemberId: string;
  
  constructor(
    private userService: UserService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {

    const redirectionMemberId: string = this.route.snapshot.paramMap.get('id');
    this.parentMemberId = localStorage.getItem('memberId');

    this.userService.getMemberById(redirectionMemberId).pipe(first()).subscribe(data => {
      this.userMember = Object.assign(new UserMember(), data);
      
    }, 
    error => {
      this.alertService.error(error);
    });
  }

  ngOnInit() {
  }

}
