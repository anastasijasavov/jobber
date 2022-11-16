import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, map, of, Subscription, switchMap, take } from 'rxjs';
import { JobOfferViewDto } from 'src/app/dtos/job-offer-view.dto';
import { UserType } from 'src/app/helper/helper';
import { JobOffer } from 'src/app/models/job-offer.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { JobOfferService } from 'src/app/services/job-offer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  jobs: JobOfferViewDto[] = [];
  jobSub = new Subscription();
  likeSub = new Subscription();
  jobLikeSub = new Subscription();
  jobApplication = new Subscription();
  userId?: number | null;
  isOrganization = false;
  constructor(
    private jobService: JobOfferService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.isOrganization =
      this.authService.getUserTypeId() === UserType.Organization;
  }

  ngOnInit(): void {
    this.jobSub = this.jobService.getJobOffers().subscribe({
      next: (res: JobOffer[]) => {
        this.jobs = res.map((job: JobOffer) => {
          const tempJob = new JobOfferViewDto(
            job.id!,
            job.header!,
            job.description!,
            job.workTypeId!,
            job.categoryId!,
            job.likesCount!
          );
          this.userId = this.authService.getUserId();
          this.jobService
            .isLikedJob(tempJob.id!, this.userId!)
            .subscribe((jobLike) => {
              tempJob.isLiked = jobLike?.length > 0 ? true : false;
            });
          this.jobService
            .isAppliedForJob(tempJob.id!, this.userId!)
            .subscribe((res) => {
              if (res?.length > 0) tempJob.isApplied = true;
            });
          return tempJob;
        });
      },
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy(): void {
    this.jobSub.unsubscribe();
    this.likeSub.unsubscribe();
    this.jobApplication.unsubscribe();
  }

  applyForJob(job: JobOfferViewDto) {
    this.jobApplication = this.jobService
      .applyForJob(this.userId!, job.id!)
      .subscribe((res) => {
        if (res) this._snackBar.open('Successfully applied for a job');
      });
  }

  removeApplication(job: JobOfferViewDto) {
    this.jobService.getUserJob(job.id!, this.userId!).pipe(
      map((res) => {
        this.jobService.removeUserJobs(res[0]).subscribe((result) => {
          this.jobs.find((j) => j.id === job.id)!.isApplied = false;
          console.log(result);

          this._snackBar.open('Successfully removed job application.');
        });
      })
    );
  }
  like(job: JobOfferViewDto, likeCount: number) {
    job.likesCount! += likeCount;
    job.isLiked = !job.isLiked;
    this.likeSub = this.jobService
      .updateJobOffer(job)
      .subscribe((res) => console.log(res));
    if (likeCount > 0)
      this.jobLikeSub = this.jobService
        .addJobLike(job.id!, this.userId!)
        .subscribe(() => console.log('success'));
    else if (likeCount < 0)
      this.jobLikeSub = this.jobService
        .removeJobLike(job.id!, this.userId!)
        .subscribe();
  }
}
