import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventsService } from '@/_services/events.service';
import { UserService, AlertService, AuthenticationService } from '@/_services';
import { ActivatedRoute } from '@angular/router';
import { UserMember } from '@/_models/user-member';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gift } from '@/_models/gift';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.styl']
})
export class MemberComponent implements OnInit {

  @ViewChild('letter') letterHtmlElement: ElementRef;
  @ViewChild('giftName') giftHtmlElement: ElementRef;
  
  userMember: UserMember;
  letterForm: FormGroup;
  giftForm: FormGroup;

  authorized = false;
  registered = false;
  tutorialClosed = false;
  showLetterEdit = false;
  showGiftEdit = false;
  giftEdited: Gift;
  
  loading = false;
  submitted = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

    this.tutorialClosed = localStorage.getItem('tutorialMember') && JSON.parse(localStorage.getItem('tutorialMember'))['tutorialClosed'];

    // get member
    const memberId: string = this.route.snapshot.paramMap.get('id');
    let memberToken: string = this.route.snapshot.paramMap.get('token');
    if (!memberToken &&
      localStorage.getItem('memberToken') &&
      memberId == localStorage.getItem('memberId'))
    {
      memberToken = localStorage.getItem('memberToken');
      memberToken = memberToken.length < 6 ? null : memberToken;
    }

    let membersRequest = memberToken ?
      this.userService.authMemberById(memberId, memberToken) :
      this.userService.getMemberById(memberId);
    
    membersRequest.pipe(first()).subscribe(
      data => {

        this.authorized = memberToken != null;
        this.registered = this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.token ? true : false;
        
        if (this.authorized) {
          localStorage.setItem('memberToken', memberToken);
          localStorage.setItem('memberId', memberId);
        }

        this.userMember = Object.assign(new UserMember(), data);
        this.initForms();
        this.letterForm.controls.letter.setValue(this.userMember.letter ? this.userMember.letter : '');
      }, 
      error => {
        if(memberToken)
          this.alertService.error('Not authorized');
        else
          this.alertService.error(error);
      });
  }

  private initForms() {

    this.letterForm = this.formBuilder.group({
      letter: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(300)]]
    });


    this.giftForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1500)]]
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
          this.alertService.success('List zapisano pomyślnie!' + (giftsNumber > 0 ? '' : ' Teraz czas na Twoje pomysły na prezenty!'));
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
    this.giftEdited = null;
    this.submitted = false;
    this.loading = false;
    this.letterForm.controls.letter.setValue(this.userMember.letter);
    this.giftForm.controls.name.setValue('');
    this.giftForm.controls.description.setValue('');
  }



  // --------- GIFT ---------------
  onSubmitGift() {

    if (this.showLetterEdit) this.showLetterEdit = false;

    if(!this.showGiftEdit) {
      this.showGiftEdit = true;
      setTimeout(() => this.giftHtmlElement.nativeElement.focus(), 200);
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

    let observable: Observable<Object>;

    if (this.giftEdited) {
      this.giftEdited.description = this.giftForm.controls.description.value;
      this.giftEdited.name = this.giftForm.controls.name.value;
      observable = this.userService.updateGiftForMember(this.userMember.id, this.giftEdited);
    } else {
      observable = this.userService.addGiftToMember(this.userMember.id, this.giftForm.value);
    }

    observable
      .pipe(first())
      .subscribe(
        data => {
          console.log(`Gift ${this.giftEdited ? 'edit complete' : 'added'}. Data`);
          this.loading = false;
          this.alertService.success(this.giftEdited ? 'Prezent zapisany' : 'Prezent dodany!', true);

          if (this.giftEdited) {
            // it was the gift edit call - just cancel
            this.onCancel();
            return; 
          }

          if (!this.userMember.gifts) this.userMember.gifts = new Array<Gift>();
          
          if (data && data['gifts'] && data['gifts'].length > this.userMember.gifts.length) {
            let newGiftId;
            newGiftId = data['gifts'].pop().id;

            const gift: Gift = Object.assign(new Gift(), this.giftForm.value);
            gift.id = newGiftId;
  
            this.userMember.gifts.push(gift);
            
            this.onCancel();
          } else {
            // reload
            // can't parse data - perform the regular page reload to refresh data
            window.location.reload();
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  editGift(giftIndex) {
    if (this.showLetterEdit) this.showLetterEdit = false;
    
    this.giftEdited = this.userMember.gifts[giftIndex];

    this.fg.description.setValue(this.giftEdited.description);
    this.fg.name.setValue(this.giftEdited.name);

    this.showGiftEdit = true;
    setTimeout(() => this.giftHtmlElement.nativeElement.focus(), 200);
  }

  closeTutorial() {
    this.tutorialClosed = true;
    localStorage.setItem('tutorialMember', JSON.stringify({ tutorialClosed: true }));
  }
}
