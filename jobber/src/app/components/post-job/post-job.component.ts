import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  JobOfferCreateDto,
  JobOfferUpdateDto,
} from 'src/app/dtos/job-offer-create.dto';
import { AuthService } from 'src/app/services/auth.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { JobOfferViewDto } from 'src/app/dtos/job-offer-view.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobCategory, JobType } from 'src/app/helper/helper';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss'],
})
export class PostJobComponent implements OnInit {
  newJobSub = new Subscription();
  jobForm: FormGroup;
  orgId: number | null;
  categories = [
    {
      id: Object.values(JobCategory)[4],
      name: 'Development',
    },
    {
      id: Object.values(JobCategory)[3],
      name: 'Office administration',
    },
    { id: Object.values(JobCategory)[5], name: 'HR' },
  ];
  isEdit: boolean;
  jobTypes = [
    { id: Object.values(JobType)[3], name: 'Full time' },
    { id: Object.values(JobType)[4], name: 'Part time' },
    { id: Object.values(JobType)[5], name: 'Remote' },
  ];
  constructor(
    private authService: AuthService,
    private jobService: JobOfferService,
    public dialogRef: MatDialogRef<PostJobComponent>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: JobOfferViewDto,
    private _snackBar: MatSnackBar
  ) {
    console.log(this.jobTypes, this.categories);
    console.log(Object.values(JobType));

    if (data) {
      this.isEdit = true;
      this.jobForm = new FormGroup({
        id: new FormControl(data.id),
        likesCount: new FormControl(data.likesCount),
        header: new FormControl(data.header, Validators.required),
        description: new FormControl(data.description, Validators.required),
        jobType: new FormControl(
          this.jobTypes.find((x) => x.id === data.workTypeId)?.id,
          [Validators.required]
        ),
        jobCategory: new FormControl(
          this.categories.find((x) => x.id === data.categoryId)?.id,
          [Validators.required]
        ),
      });
    } else {
      this.isEdit = false;
      this.jobForm = new FormGroup({
        header: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        jobType: new FormControl('', [Validators.required]),
        jobCategory: new FormControl('', [Validators.required]),
      });
    }

    this.orgId = this.authService.getUserId();
  }

  ngOnInit(): void {}

  open() {}

  onSelectedJobType(id: number) {
    this.jobForm.patchValue({ jobType: id });
  }
  onSelectJobCat(id: number) {
    this.jobForm.patchValue({ jobCategory: id });
  }
  submit() {
    if (!this.isEdit) {
      const job: JobOfferCreateDto = new JobOfferCreateDto();
      job.header = this.jobForm.value.header;
      job.description = this.jobForm.value.description;
      job.workTypeId = Number.parseFloat(this.jobForm.value.jobType);
      job.categoryId = Number.parseFloat(this.jobForm.value.jobCategory);
      job.createdBy = this.orgId!;
      this.jobService.addJobOffer(job).subscribe((res: JobOfferCreateDto) => {
        if (res) {
          this.sharedService.sendJob(res);
        }
      });
    } else {
      const job: JobOfferUpdateDto = {
        id: this.jobForm.value.id,
        likesCount: this.jobForm.value.likesCount,
        header: this.jobForm.value.header,
        description: this.jobForm.value.description,
        workTypeId: Number.parseFloat(this.jobForm.value.jobType),
        categoryId: Number.parseFloat(this.jobForm.value.jobCategory),
        createdBy: this.orgId!,
      };
      this.jobService.updateJobOffer(job).subscribe((res) => {
        this._snackBar.open('Successfully updated job offer!', '', {
          duration: 3000,
          panelClass: ['green-snack'],
        });
      });
    }
  }
}
