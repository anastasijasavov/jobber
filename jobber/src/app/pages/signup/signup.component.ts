import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserCreateDto } from 'src/app/dtos/user-create.dto';
import { UserType } from 'src/app/helper/helper';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  userCreateForm: FormGroup;
  signUpSub = new Subscription();
  constructor(private authService: AuthService, private router: Router) {
    this.userCreateForm = new FormGroup({
      email: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      userType: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
    });
  }
  submit() {
    const userCreateDto = new UserCreateDto();
    userCreateDto.email = this.userCreateForm.get('email')?.value;
    userCreateDto.firstName = this.userCreateForm.get('firstName')?.value;
    userCreateDto.lastName = this.userCreateForm.get('lastName')?.value;
    userCreateDto.password = this.userCreateForm.get('password')?.value;
    userCreateDto.userTypeId =
      this.userCreateForm.get('userType')?.value === 'user'
        ? UserType.User
        : UserType.Organization;
    userCreateDto.phoneNumber = this.userCreateForm.get('phoneNumber')?.value;
    this.signUpSub = this.authService.signup(userCreateDto).subscribe((res) => {
      localStorage.setItem(
        'user',
        JSON.stringify({ email: res.email, id: res.id })
      );
      this.router.navigate(['home']);
    });
  }
}
