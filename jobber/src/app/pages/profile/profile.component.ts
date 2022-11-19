import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { UserType } from 'src/app/helper/helper';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { JobOfferService } from 'src/app/services/job-offer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
  user: User | null = null;
  userForm: FormGroup;
  userSub = new Subscription();
  userSaveSub = new Subscription();
  userDelSub = new Subscription();
  inputMode: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private jobService: JobOfferService,
    private _snackBar: MatSnackBar
  ) {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      passwordHash: new FormControl('', Validators.required),
      phoneNumber: new FormControl(''),
    });

    this.userSub = this.authService
      .getUserByEmail(this.authService.getUserEmail()!)
      .subscribe((res: User[]) => {
        this.user = res[0];
        this.userForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          passwordHash: this.user.passwordHash,
          phoneNumber: this.user.phoneNumber,
        });
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userSaveSub.unsubscribe();
    this.userDelSub.unsubscribe();
  }

  changeMode() {
    this.inputMode = !this.inputMode;
  }

  updateUser() {
    if (this.user) {
      this.user.firstName = this.userForm.get('firstName')?.value;
      this.user.lastName = this.userForm.get('lastName')?.value;
      this.user.passwordHash = this.userForm.get('passwordHash')?.value;
      this.user.phoneNumber = this.userForm.get('phoneNumber')?.value;
      this.userSaveSub = this.authService
        .saveUserInfo(this.user)
        .subscribe((res) =>
          this._snackBar.open('Saved profile information', '', {
            duration: 3000,
            panelClass: ['green-snack'],
          })
        );
    }
  }
  deleteAccount() {
    this.userDelSub = this.authService
      .deleteUser(this.user?.id!)
      .pipe(
        map((res) => {
          if (this.user?.userTypeId === UserType.User)
            //delete related userJobs
            this.jobService
              .removeUserJobs({ userId: this.user?.id! })
              .subscribe((res) =>
                console.log('removed linked job applications')
              );
          //delete related job offers
          else this.jobService.removeJobOffers(this.user?.id!);
        })
      )
      .subscribe((res) => {
        this.router.navigate(['login']);
      });
  }
}
