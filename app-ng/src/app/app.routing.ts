import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { EventsComponent } from './events/events.component';
import { SingleEventComponent } from './event-single/event-single.component';
import { EventNewMemberComponent } from './event-new-member/event-new-member.component';
import { MemberComponent } from './member/member.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
    { path: 'events/:id', component: SingleEventComponent, canActivate: [AuthGuard] },
    { path: 'events/:id/new-member', component: EventNewMemberComponent, canActivate: [AuthGuard] },
    { path: 'member/:id', component: MemberComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);