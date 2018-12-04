import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from '@/_models/user';
import { Subscription } from 'rxjs';
import { EventsService } from '@/_services/events.service';
import { AuthenticationService, AlertService } from '@/_services';
import { ActivatedRoute } from '@angular/router';
import { Event } from '@/_models/event';
import { UserMember } from '@/_models/user-member';
import { first } from 'rxjs/operators';
import * as shuffle from 'shuffle-array';

@Component({
  selector: 'app-event-draw',
  templateUrl: './event-draw.component.html',
  styleUrls: ['./event-draw.component.styl']
})
export class EventDrawComponent implements OnInit {

  currentUser: User;
  event: Event;
  currentUserSubscription: Subscription;
  loading: Boolean = false;
  
  constructor(
    private titleService: Title,
    private eventsService: EventsService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

  }

  ngOnInit() {
    this.titleService.setTitle('Secret Santa – Event draw');
    this.route.params.subscribe(params => {
      
      // get event data for event with id from the URL parameter
      this.eventsService.getById(params['id']).pipe(first()).subscribe(eventData => {
        this.event = Object.assign(new Event(), eventData);
        this.event.members = this.event.members.map(memberData => Object.assign(new UserMember(), memberData));
        let tempMembers = this.event.members.slice();
        shuffle(tempMembers);
        tempMembers.forEach((member, index) => {
          member['tempId'] = index;
        });

        let drawnMembers: UserMember[] = this.event.members.slice();
        
        let testOk = true, attempts = 0;
        do {
          shuffle(drawnMembers);
          testOk = true;
          tempMembers.some((member, index) => {
            if (member == drawnMembers[index]) {
              testOk = false;
              return true;
            }
          });
        } while (!testOk && attempts < 500);

        if (testOk) {
          tempMembers.forEach((member, index) => {
            member['drawnMember'] = drawnMembers[index];
          });

          this.event.members.sort((a, b) => a['tempId'] - b['tempId']);

          this.alertService.success('Drawing succeed');
        } else {
          this.alertService.error('Drawing failed');
        }
      }, error => {
        this.alertService.error("No such event", error)
        });
      
    });
  }

  saveResults() {
    if (this.loading) return;
    const results = this.event.members.map(
      member => {
        return {
          memberId: member.id,
          drawnMemberId: member['drawnMember'].id
        }
      }
    );
    
    this.loading = true;

    this.eventsService.saveResults(this.event.id, results).pipe(first()).subscribe(
      responseData => {
        this.alertService.success('Result saved successfully');
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
    
  }



}
