import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from 'src/app/helper/helper';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  mode: string;
  isUser: boolean = true;
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    this.mode = 'side';
    this.isLoggedIn = this.authService.getUserId() ? true : false;
    if (!this.isLoggedIn) this.router.navigate(['login']);
    const userType = this.authService.getUserTypeId();
    if (userType === UserType.User) {
      this.isUser = true;
    } else this.isUser = false;
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
