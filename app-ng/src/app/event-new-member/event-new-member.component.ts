import { Component, OnInit } from '@angular/core';
import { Event } from '@/_models/event';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, AlertService } from '@/_services';
import { first } from 'rxjs/operators';
import { EventsService } from '@/_services/events.service';

@Component({
  selector: 'app-event-new-member',
  templateUrl: './event-new-member.component.html',
  styleUrls: ['./event-new-member.component.styl']
})
export class EventNewMemberComponent implements OnInit {
  
  // event to add the new member to
  event: Event;
  
  registerForm: FormGroup;
  loading = false;
  submitted = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private eventsService: EventsService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });

    
    this.route.params.subscribe(params => {
      
      // get event data for event with id from the URL parameter
      this.eventsService.getById(params['id']).pipe(first()).subscribe(eventData => {
        this.event = Object.assign(new Event(), eventData);
      }, error => {
        this.alertService.error("No such event", error)
        });
      
    });
  }


  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.addUnregistered(this.registerForm.value, this.event.id)
      .pipe(first())
      .subscribe(
        data => {
          console.log('New member registration complete. Data', data);
          
          // add him to the event
          this.addUserToEvent(data);
        },
        error => {
          this.alertService.error('Step 1. ' + error);
          this.loading = false;
        });
  }

  private addUserToEvent(data) {
    this.eventsService.addUserToEvent(this.event.id, data._id)
      .pipe(first())
      .subscribe(
        data => {
          console.log('New member added to the event. Data', data);
          
          this.loading = false;
          
          this.alertService.success('New member created successfully', true);
          this.router.navigate([`/events/${this.event.id}`]);
        },
        error => {
          this.alertService.error('Step 2. ' + error);
          this.loading = false;
        });
  }
}
