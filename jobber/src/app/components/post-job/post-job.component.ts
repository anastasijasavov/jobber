import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobOfferCreateDto } from 'src/app/dtos/job-offer-create.dto';
import { AuthService } from 'src/app/services/auth.service';
import { JobOfferService } from 'src/app/services/job-offer.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobCategory } from 'src/app/models/job-category.model';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss'],
})
export class PostJobComponent implements OnInit {
  newJobSub = new Subscription();
  jobForm: FormGroup;
  orgId: number | null;
  categories: JobCategory[];
  constructor(
    private authService: AuthService,
    private jobService: JobOfferService,
    public dialogRef: MatDialogRef<PostJobComponent>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: JobOfferCreateDto
  ) {
    this.jobService
      .getJobCategories()
      .subscribe((categories) => (this.categories = categories));
    this.orgId = this.authService.getUserId();
    this.jobForm = new FormGroup({
      header: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      jobType: new FormControl(0, Validators.required),
      jobCategory: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {}

  open() {}

  submit() {
    const job: JobOfferCreateDto = new JobOfferCreateDto();
    job.header = this.jobForm.value.header;

    job.description = this.jobForm.value.description;
    console.log(this.jobForm.value);

    job.workTypeId = Number.parseFloat(this.jobForm.value.jobType);
    job.categoryId = Number.parseFloat(this.jobForm.value.jobCategory);
    job.createdBy = this.orgId!;
    this.jobService.addJobOffer(job).subscribe((res: JobOfferCreateDto) => {
      if (res) {
        this.sharedService.sendJob(res);
      }
    });
  }
}
