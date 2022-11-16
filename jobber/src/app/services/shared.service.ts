import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { JobOfferCreateDto } from '../dtos/job-offer-create.dto';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private newJobSource = new Subject();
  newJobMessage = this.newJobSource.asObservable();

  private loginSource = new Subject();
  loginSucess$ = this.loginSource.asObservable();

  constructor() {}

  sendJob(job: JobOfferCreateDto) {
    this.newJobSource.next(job);
  }
  notifyOfLogin() {
    this.loginSource.next('login');
  }
}
