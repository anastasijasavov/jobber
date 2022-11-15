import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostJobComponent } from 'src/app/components/post-job/post-job.component';
import { JobOfferCreateDto } from 'src/app/dtos/job-offer-create.dto';
import { JobOfferViewDto } from 'src/app/dtos/job-offer-view.dto';
import { JobOffer } from 'src/app/models/job-offer.model';
import { UserJob } from 'src/app/models/user-job.model';
import { AuthService } from 'src/app/services/auth.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-my-job-offers',
  templateUrl: './my-job-offers.component.html',
  styleUrls: ['./my-job-offers.component.scss'],
})
export class MyJobOffersComponent implements OnInit {
  @ViewChild('app-post-job') postJobDialog: PostJobComponent;

  jobOffers: JobOfferViewDto[];
  constructor(
    private jobService: JobOfferService,
    private authService: AuthService,
    private sharedService: SharedService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getJobs();
    this.sharedService.newJobMessage.subscribe((res) => {
      if (res) this.getJobs();
    });
  }

  getJobs() {
    this.jobService
      .getJobsByOrganization(this.authService.getUserId()!)
      .subscribe((res: JobOffer[]) => {
        this.jobOffers = res.map((job) => {
          return {
            header: job.header,
            description: job.description,
            categoryId: job.categoryId,
            workTypeId: job.workTypeId,
            likesCount: job.likesCount!,
            id: job.id,
            isLiked: false,
            candidates: [],
          };
        });
      });
  }
  showCandidates(jobId: number) {
    this.jobService.getCandidatesByJob(jobId).subscribe((res) =>
      res.forEach((jobUser) =>
        this.authService.getUserById(jobUser.userId!).subscribe((user) => {
          this.jobOffers.find((x) => x.id === jobId)?.candidates?.push(user);
        })
      )
    );
  }

  updateCandidate(userId: number, jobId: number, isApproved: boolean) {
    this.jobService
      .getUserJob(userId, jobId)
      .subscribe((userJobs: UserJob[]) => {
        if (userJobs?.length > 0) {
          let userJob = userJobs[0];
          userJob.isApproved = isApproved;
          this.jobService
            .updateUserJob(userJob.id!, userJob)
            .subscribe((res) => {
              console.log(res);

              if (isApproved === false) {
                this.jobOffers
                  .find((x) => x.id === jobId)
                  ?.candidates?.filter((x) => x.id !== userId);
              }
            });
        }
      });
  }

  openJobDialog() {
    const dialogRef = this.dialog.open(PostJobComponent, {
      width: '450px',
      height: '450px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.jobOffers.push(result);
    });
  }
}
