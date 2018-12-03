import { Component, OnInit, Input } from '@angular/core';
import { EventsService } from '@/_services/events.service';
import { UserService, AuthenticationService, AlertService } from '@/_services';
import { User } from '@/_models/user';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.styl']
})
export class EventsComponent implements OnInit {

  currentUser: User;
  currentUserSubscription: Subscription;
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  // simple list mode
  @Input() listMode: Boolean = false;

  constructor(
    private eventsService: EventsService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
    });
  }

  ngOnInit() {
    if (this.listMode) return;

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  
  onSubmitCreate() {
    // create new event
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.eventsService.createNew(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('New event creation complete. Data', data);
          // this.loading = false;
          this.alertService.success('Event created successfully', true);
          //this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

  }

}
