import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventsService } from '@/_services/events.service';
import { UserService, AlertService } from '@/_services';
import { ActivatedRoute } from '@angular/router';
import { UserMember } from '@/_models/user-member';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.styl']
})
export class MemberComponent implements OnInit {

  @ViewChild('letter') letterHtmlElement: ElementRef;
  
  userMember: UserMember;
  letterForm: FormGroup;
  giftForm: FormGroup;

  showLetterEdit = false;
  showGiftEdit = false;
  
  loading = false;
  submitted = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // get member
    const param = this.route.snapshot.paramMap.get('id');
    this.userService.getMemberById(param).pipe(first()).subscribe(
      data => {
        this.userMember = Object.assign(new UserMember(), data);
        this.initForms();
        this.letterForm.controls.letter.setValue(this.userMember.letter ? this.userMember.letter : '');
      }, 
      error => {
        this.alertService.error(error);
      });
  }

  private initForms() {

    this.letterForm = this.formBuilder.group({
      letter: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(300)]]
    });


    this.giftForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  // convenience getter for easy access to form fields
  get fl() { return this.letterForm.controls; }
  get fg() { return this.giftForm.controls; }

  onSubmitLetter() {
    if (this.showGiftEdit) this.showGiftEdit = false;

    if (!this.showLetterEdit) {
      this.showLetterEdit = true;
      setTimeout(() => this.letterHtmlElement.nativeElement.focus(), 200);
      return;
    }

    // validate & save
    // create new event
    this.submitted = true;

    // stop here if form is invalid
    if (this.letterForm.invalid) {
      return;
    }

    this.loading = true;

    this.userMember.letter = this.letterForm.controls.letter.value;


    this.userService.updateMemberLetter(this.userMember.id, this.userMember.letter)
      .pipe(first())
      .subscribe(
        data => {
          console.log('User member letter update complete.Data', data);
          this.loading = false;
          const giftsNumber = this.userMember.gifts ? this.userMember.gifts.length : 0;
          this.alertService.success('List zapisano pomyślnie! Hm... na pewno są w nim wszystkie uczynki? :P' + (giftsNumber > 0 ? '' : ' Teraz czas na Twoje pomysły na prezenty!'), true);
          this.showLetterEdit = false;
          this.submitted = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  onCancel() {
    this.showLetterEdit = false;
    this.showGiftEdit = false;
    this.submitted = false;
    this.loading = false;
    this.letterForm.controls.letter.setValue(this.userMember.letter);
  }

  // ------------------------
  onSubmitGift() {

    if (this.showLetterEdit) this.showLetterEdit = false;

    if(!this.showGiftEdit) {
      this.showGiftEdit = true;
      return;
    }
    

    // validate & save
    // create new event
    this.submitted = true;

    // stop here if form is invalid
    if (this.giftForm.invalid) {
      return;
    }

    this.loading = true;
  }
}
