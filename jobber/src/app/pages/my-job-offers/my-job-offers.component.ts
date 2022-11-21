import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
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
  isEmptyData = false;
  jobOffers: JobOfferViewDto[];
  constructor(
    private jobService: JobOfferService,
    private authService: AuthService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
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
        if (res?.length > 0) this.isEmptyData = true;
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
            isApplied: true,
            showCandidates: false,
          };
        });
      });
  }
  showCandidates(jobId: number) {
    if (!this.jobOffers.find((x) => x.id === jobId)?.showCandidates)
      this.jobService.getCandidatesByJob(jobId).subscribe((res) =>
        res.forEach((jobUser) =>
          this.authService.getUserById(jobUser.userId!).subscribe((user) => {
            const tempJob = this.jobOffers.find((x) => x.id === jobId);
            tempJob?.candidates?.push(user);
            tempJob!.showCandidates = true;
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
          if (userJob.isApproved !== isApproved) {
            userJob.isApproved = isApproved;
            this.jobService
              .updateUserJob(userJob.id!, userJob)
              .subscribe((res) => {
                if (isApproved === false) {
                  this.jobOffers
                    .find((x) => x.id === jobId)
                    ?.candidates?.filter((x) => x.id !== userId);
                  this._snackBar.open(
                    'Successfully declined this candidate.',
                    '',
                    {
                      duration: 3000,
                      panelClass: ['green-snack'],
                    }
                  );
                } else {
                  this._snackBar.open(
                    'Successfully approved this candidate.',
                    '',
                    {
                      duration: 3000,
                      panelClass: ['green-snack'],
                    }
                  );
                }
              });
          } else {
            this._snackBar.open(
              `You already ${
                isApproved ? 'approved ' : 'declined '
              } this candidate`,
              '',
              {
                duration: 3000,
                panelClass: ['red-snack'],
              }
            );
          }
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
      if (result) {
        this.jobOffers.push(result);
        this.isEmptyData = false;
      }
    });
  }

  openEditJob(job: JobOfferViewDto) {
    const dialogRef = this.dialog.open(PostJobComponent, {
      width: '450px',
      height: '450px',
      data: job,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getJobs();
        this.isEmptyData = false;
      }
    });
  }

  deleteJob(id: number) {
    this.jobService
      .removeJobOffer(id)
      .pipe(
        map((res) => {
          return this.jobService.removeUserJobs({ jobId: id });
        })
      )
      .subscribe((res) => {
        this.jobOffers = this.jobOffers.filter((x) => x.id !== id);
        this._snackBar.open('Succesfully removed job offer', '', {
          duration: 3000,
          panelClass: ['green-snack'],
        });
      });
  }
}
