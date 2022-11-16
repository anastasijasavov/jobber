import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { UserLoginDto } from 'src/app/dtos/user-login.dto';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  userLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    pass: new FormControl('', [Validators.required, Validators.min(5)]),
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  sub: Subscription = new Subscription();
  ngOnInit(): void {}

  submit() {
    const user: UserLoginDto = {
      email: this.userLogin.controls['email'].value,
      pass: this.userLogin.controls['pass'].value,
    };

    this.sub = this.authService.login(user).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.authService.getUserByEmail(user.email!).subscribe((res) => {
            localStorage.setItem(
              'user',
              JSON.stringify({
                email: user.email!,
                id: res[0].id!,
                userType: res[0].userTypeId,
              })
            );
          });
          this.sharedService.notifyOfLogin();
          this.router.navigate(['home']);
        }
        //else add validation
      },
      error: (err) => console.error(err),
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
