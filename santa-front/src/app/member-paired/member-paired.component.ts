import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserMember } from '@/_models/user-member';
import { UserService, AlertService } from '@/_services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-paired',
  templateUrl: './member-paired.component.html',
  styleUrls: ['./member-paired.component.styl']
})
export class MemberPairedComponent implements OnInit {

  userMember: UserMember;
  pairedMember: UserMember;

  authorized = false;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private alertService: AlertService,
  ) { }

  ngOnInit() {

    const memberId = this.route.snapshot.paramMap.get('id');
    let memberToken = this.route.snapshot.paramMap.get('token');
    if (!memberToken &&
      localStorage.getItem('memberToken') &&
      memberId == localStorage.getItem('memberId')) {

      memberToken = localStorage.getItem('memberToken');
      memberToken = memberToken.length < 6 ? null : memberToken;

    }

    const membersRequest = memberToken ?
      this.userService.authMemberById(memberId, memberToken) :
      this.userService.getMemberById(memberId);

    membersRequest.pipe(first()).subscribe(
      data => {

        this.authorized = memberToken != null;

        if (this.authorized) {
          localStorage.setItem('memberToken', memberToken);
          localStorage.setItem('memberId', memberId);
        }

        this.userMember = Object.assign(new UserMember(), data);
        this.pairedMember = this.userMember.pairedMemberId ? Object.assign(new UserMember(), this.userMember.pairedMemberId) : null;
      },
      error => {
        if (memberToken) {
          this.alertService.error('Not authorized');
        } else {
          this.alertService.error(error);
        }
      });
  }

}
