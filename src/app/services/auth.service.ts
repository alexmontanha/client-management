import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.exemplo.com';

  constructor(private http: HttpClient) {}

  login(user: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      user,
      password
    });
  }
}
