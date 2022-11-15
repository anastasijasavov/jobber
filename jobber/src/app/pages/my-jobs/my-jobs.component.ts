import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  concatMap,
  from,
  map,
  mergeMap,
  Observable,
  Observer,
  Subscription,
  switchMap,
  toArray,
} from 'rxjs';
import { JobOfferCreateDto } from 'src/app/dtos/job-offer-create.dto';
import { JobOfferViewDto } from 'src/app/dtos/job-offer-view.dto';
import { UserJobsDto } from 'src/app/dtos/user-jobs.dto';
import { UserType } from 'src/app/helper/helper';
import { JobOffer } from 'src/app/models/job-offer.model';
import { JobType } from 'src/app/models/job-type.model';
import { UserJob } from 'src/app/models/user-job.model';
import { AuthService } from 'src/app/services/auth.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.scss'],
})
export class MyJobsComponent implements OnInit, OnDestroy {
  myJobs: UserJobsDto[] = [];
  myJobs$: Observable<UserJobsDto[]>;
  jobTypes: JobType[] = [];
  jobCategories: JobType[] = [];
  jobsSub = new Subscription();
  constructor(
    private jobService: JobOfferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.jobService.getJobTypes().subscribe((res) => (this.jobTypes = res));
    this.jobService
      .getJobCategories()
      .subscribe((res) => (this.jobCategories = res));

    this.myJobs$ = this.jobService
      .getMyJobs(this.authService.getUserId()!)
      .pipe(
        switchMap((myJobs) => from(myJobs)),
        mergeMap((job) =>
          this.jobService.getJobOfferById(job.jobId!).pipe(
            map((jobOffer) => {
              const userJobDto = new UserJobsDto(
                jobOffer.id!,
                jobOffer.header!,
                jobOffer.description!,
                jobOffer.workTypeId!,
                jobOffer.categoryId!,
                jobOffer.likesCount!
              );
              userJobDto.appliedAt = job.appliedAt;
              userJobDto.isApproved = job.isApproved;
              userJobDto.userId = this.authService.getUserId()!;

              userJobDto.jobCategoryName = this.jobCategories.find(
                (x) => x.id === userJobDto.categoryId
              )?.name;
              userJobDto.jobTypeName = this.jobTypes.find(
                (x) => x.id === userJobDto.workTypeId
              )?.name;
              return userJobDto;
            })
          )
        ),
        toArray()
      );
  }

  ngOnDestroy(): void {
    this.jobsSub.unsubscribe();
  }
}
