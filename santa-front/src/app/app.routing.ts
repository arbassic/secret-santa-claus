import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { EventsComponent } from './events/events.component';
import { SingleEventComponent } from './event-single/event-single.component';
import { EventNewMemberComponent } from './event-new-member/event-new-member.component';
import { MemberComponent } from './member/member.component';
import { MemberEventComponent } from './member-event/member-event.component';
import { EventDrawComponent } from './event-draw/event-draw.component';
import { MemberPairedComponent } from './member-paired/member-paired.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
    { path: 'events/:id', component: SingleEventComponent, canActivate: [AuthGuard] },
    { path: 'events/:id/new-member', component: EventNewMemberComponent, canActivate: [AuthGuard] },
    { path: 'events/:id/pair-draw', component: EventDrawComponent, canActivate: [AuthGuard] },
    { path: 'member/event/:id', component: MemberEventComponent },
    { path: 'member/:id', component: MemberComponent },
    { path: 'member/:id/:token/paired', component: MemberPairedComponent },
    { path: 'member/:id/:token', component: MemberComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);