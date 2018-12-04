import { Injectable } from '@angular/core';
import { Event } from '@/_models/event';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '@/_models/user';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  createNew(event: Event) {
    return this.http.post<Event[]>(`${environment.apiEndpoint}/events/create`, event);
  }

  update(event: Event) {
    return this.http.put(`${environment.apiEndpoint}/events/${event.id}`, event);
  }

  addUserToEvent(id: string, userId: string) {
    return this.http.put(`${environment.apiEndpoint}/events/${id}`, { userId });
  }
  
  delete(id: string) {
    return this.http.delete(`${environment.apiEndpoint}/events/${id}`);
  }

  getById(id: string) {
    return this.http.get(`${environment.apiEndpoint}/events/${id}`);
  }

  saveResults(id: string, results: { memberId: string, drawnMemberId: string, }[]) {
    return this.http.put(`${environment.apiEndpoint}/events/${id}/results`, { results });
  }
  
}
