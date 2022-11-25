/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// Entities
import User from '../Entity/User.entity';
import FormValues from '../Entity/FormValues.entity';

// config
import Config from './variables.config';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loggedIn = false;
  private user: User = new User('', '');

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUser(): User {
    return this.user;
  }

  getJwt(): string {
    return this.user.jwt;
  }

  login(data: FormValues) {
    if (!data.email || !data.password) {
      return;
    }
    const pHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify(data);
    this.http
      .post<string>(`${Config.serverUrl}/${Config.user.auth}`, body, {
        headers: pHeaders,
        responseType: 'text' as 'json',
      })
      .subscribe({
        error: (err) => console.log(err),
        next: (resp: any) => {
          const gHeaders = new HttpHeaders({ Authorization: `Bearer ${resp}` });
          this.http
            .get<any>(`${Config.serverUrl}/${Config.user.profile}`, {
              headers: gHeaders,
            })
            .subscribe({
              error: (err) => console.log(err),
              next: (userInfo: any) => {
                this.user.email = data.email;
                this.user.userId = userInfo._id;
                this.user.username = userInfo.name;
                this.user.role = userInfo.role;
                this.user.jwt = resp;
                this.loggedIn = true;
                this.router.navigate(['/home']);
              },
            });
        },
      });
  }

  logout() {
    this.loggedIn = false;
    this.user.email = '';
    this.user.jwt = '';
    this.user.role = '';
    this.user.username = '';
    this.router.navigate(['/login']);
  }
}
