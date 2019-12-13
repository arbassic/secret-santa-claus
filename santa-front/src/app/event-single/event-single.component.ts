import { Component, OnInit } from '@angular/core';
import { EventsService } from '@/_services/events.service';
import { AuthenticationService, AlertService } from '@/_services';
import { User } from '@/_models/user';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Event } from '@/_models/event';
import { Location } from '@angular/common';
import { UserMember } from '@/_models/user-member';

@Component({
  selector: 'app-event-single',
  templateUrl: './event-single.component.html',
  styleUrls: ['./event-single.component.styl']
})
export class SingleEventComponent implements OnInit {

  baseURL: String;
  currentUser: User;
  event: Event;
  currentUserSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private location: Location
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.baseURL = window.location.href.replace(this.location.path(), '');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      // get event data for event with id from the URL parameter
      this.eventsService
        .getById(params['id'])
        .pipe(first())
        .subscribe(eventData => {
          this.event = Object.assign(new Event(), eventData);
          this.event.members =
            this.event.members
            .map(memberData => Object.assign(new UserMember(), memberData));
        }, error => {
          this.alertService.error('No such event', error);
        });

    });
  }

  onMemberUrlCopied(event, memberName) {
    if (event && event.isSuccess) {
      this.alertService.success(`Skopiowano dla ${memberName}`);
    } else {
      this.alertService.error(`Nie udało się skopiować`);
    }
  }

}
