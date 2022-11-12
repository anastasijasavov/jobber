import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Constants } from '../app.constants';
import { UserCreateDto } from '../dtos/user-create.dto';
import { UserLoginDto } from '../dtos/user-login.dto';
import { User } from '../models/user.model';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpUtilsService, private router: Router) {}

  signup(user: UserCreateDto) {
    this.httpService
      .post(Constants.BASE_URL + Constants.USERS_ENDPOINT, user)
      .subscribe((res) => console.log(res));
  }

  login(user: UserLoginDto) {
    const params = [
      { name: 'email', value: user.email },
      { name: 'password', value: user.pass },
    ];
    return this.httpService.get(
      Constants.BASE_URL + Constants.USERS_ENDPOINT,
      params
    );
  }

  logout(): boolean {
    localStorage.clear();
    this.router.navigate(['login']);
    return true;
  }

  getUserEmail() {
    return JSON.parse(localStorage.getItem('user')!).email;
  }
  getUserId() {
    return Number.parseInt(JSON.parse(localStorage.getItem('user')!).id);
  }
  getUserByEmail(email: string): Observable<User[]> {
    const params = [{ name: 'email', value: email }];
    return this.httpService.get(
      Constants.BASE_URL + Constants.USERS_ENDPOINT,
      params
    );
  }

  saveUser(user: User): Observable<User> {
    return this.httpService.put(
      Constants.BASE_URL + Constants.USERS_ENDPOINT + '/' + user.id,
      user
    );
  }
}
