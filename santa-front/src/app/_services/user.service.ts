import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@/_models/user';
import { environment } from 'environments/environment';
import { Gift } from '@/_models/gift';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiEndpoint}/users`);
    }

    getById(id: String) {
        return this.http.get(`${environment.apiEndpoint}/users/${id}`);
    }

    getMemberById(id: String) {
        return this.http.get(`${environment.apiEndpoint}/users/member/${id}`);
    }

    updateMemberLetter(id: String, letter: String) {
        return this.http.put(`${environment.apiEndpoint}/users/member/letter/${id}`, { letter });
    }

    addGiftToMember(id: String, gift: Gift) {
        return this.http.post(`${environment.apiEndpoint}/users/member/gift/${id}`, gift);
    }

    updateGiftForMember(memberId: String, gift: Gift) {
        return this.http.put(`${environment.apiEndpoint}/users/member/gift/${memberId}`, gift);
    }

    register(user: User) {
        return this.http.post(`${environment.apiEndpoint}/users/register`, user);
    }

    addUnregistered(user: User, eventId: String) {
        return this.http.post(`${environment.apiEndpoint}/users/unregistered`, { eventId, user });
    }

    update(user: User) {
        return this.http.put(`${environment.apiEndpoint}/users/${user.id}`, user);
    }

    delete(id: String) {
        return this.http.delete(`${environment.apiEndpoint}/users/${id}`);
    }
}