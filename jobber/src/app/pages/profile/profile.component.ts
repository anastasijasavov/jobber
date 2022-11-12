import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserCreateDto } from 'src/app/dtos/user-create.dto';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User = {};
  userSub = new Subscription();
  userSaveSub = new Subscription();
  inputMode: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService
      .getUserByEmail(this.authService.getUserEmail()!)
      .subscribe((res: User[]) => {
        this.user = res[0];
        console.log(this.user);
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userSaveSub.unsubscribe();
  }

  changeMode() {
    this.inputMode = !this.inputMode;
  }
  updateUser() {
    this.userSaveSub = this.authService
      .saveUser(this.user)
      .subscribe((res) => console.log(res));
  }
}
