import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  mode: string;
  constructor(private authService: AuthService) {
    this.mode = 'side';
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
