import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './_components';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './home';
import { RegisterComponent } from './register';
import { EventsComponent } from './events/events.component';
import { SingleEventComponent } from './event-single/event-single.component';
import { EventNewMemberComponent } from './event-new-member/event-new-member.component';
import { MemberComponent } from './member/member.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ClipboardModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    EventsComponent,
    SingleEventComponent,
    EventNewMemberComponent,
    MemberComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
