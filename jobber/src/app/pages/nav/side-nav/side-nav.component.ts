import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from 'src/app/helper/helper';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  mode: string;
  isUser: boolean = true;
  isLoggedIn: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
  ) {
    if (!this.authService.getUserEmail()) {
      this.isLoggedIn = false;
      this.router.navigate(['login']);
    } else this.isLoggedIn = true;
    this.sharedService.loginSucess$.subscribe((res) => {
      if (res === 'login') {
        this.setNavForUser();
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit(): void {
    this.setNavForUser();
  }

  logout() {
    this.isLoggedIn = false;
    this.authService.logout();
  }

  setNavForUser() {
    const userType = this.authService.getUserTypeId();
    if (userType === UserType.User) {
      this.isUser = true;
    } else this.isUser = false;
  }
}
