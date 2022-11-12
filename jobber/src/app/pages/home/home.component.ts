import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, map, of, Subscription, switchMap, take } from 'rxjs';
import { JobOfferViewDto } from 'src/app/dtos/job-offer-view.dto';
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
  userId?: number;
  constructor(
    private jobService: JobOfferService,
    private authService: AuthService
  ) {}

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
              tempJob.isLiked = jobLike && jobLike.length > 0 ? true : false;
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
  }

  applyForJob(job: JobOfferViewDto) {}
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