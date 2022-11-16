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
    return this.httpService.post<User>(
      Constants.BASE_URL + Constants.USERS_ENDPOINT,
      user
    );
  }

  login(user: UserLoginDto) {
    const params = [
      { name: 'email', value: user.email! },
      { name: 'password', value: user.pass! },
    ];
    return this.httpService.get<User[]>(
      Constants.BASE_URL + Constants.USERS_ENDPOINT,
      params
    );
  }

  logout(): boolean {
    localStorage.clear();
    this.router.navigate(['login']);
    return true;
  }

  getUserEmail(): string | null {
    const user: Pick<User, 'email' | 'id'> = JSON.parse(
      localStorage.getItem('user')!
    );
    return user?.email;
  }
  getUserId() {
    const user = localStorage.getItem('user');
    if (user) return Number.parseInt(JSON.parse(user).id);
    else return null;
  }
  getUserTypeId() {
    const user = localStorage.getItem('user');
    if (user) return Number.parseInt(JSON.parse(user).userType);
    else return null;
  }
  getUserByEmail(email: string): Observable<User[]> {
    const params = [{ name: 'email', value: email }];
    return this.httpService.get<User[]>(
      Constants.BASE_URL + Constants.USERS_ENDPOINT,
      params
    );
  }

  getUserById(id: number) {
    return this.httpService.get<User>(
      Constants.BASE_URL + Constants.USERS_ENDPOINT + '/' + id
    );
  }

  saveUserInfo(user: User): Observable<User> {
    return this.httpService.put(
      Constants.BASE_URL + Constants.USERS_ENDPOINT + '/' + user.id,
      user
    );
  }

  deleteUser(id: number) {
    return this.httpService.delete(
      Constants.BASE_URL + Constants.USERS_ENDPOINT + '/' + id
    );
  }
}
