import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@/_models/user';
import { environment } from 'environments/environment';
import { Event } from '@/_models/event';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    const userStored = localStorage.getItem('currentUser');
    const user: User = userStored ? this.parseUser(JSON.parse(userStored)) : null;
    this.currentUserSubject = new BehaviorSubject<User>(user);

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiEndpoint}/users/authenticate`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(this.parseUser(user));
        }

        return user;
      }));
  }

  private parseUser(data: Object) {
      let user = Object.assign(new User(), data);
      user.events = user.events.map(data => Object.assign(new Event(), data));
      return user;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}