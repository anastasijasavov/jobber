import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Constants } from '../app.constants';
import { JobOfferCreateDto } from '../dtos/job-offer-create.dto';
import { JobOfferViewDto } from '../dtos/job-offer-view.dto';
import { Param } from '../helper/helper';
import { JobLike } from '../models/job-like.model';
import { JobOffer } from '../models/job-offer.model';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root',
})
export class JobOfferService {
  constructor(private httpService: HttpUtilsService) {}

  addJobOffer(offer: JobOfferCreateDto) {
    this.httpService.post(Constants.BASE_URL + Constants.JOBS_ENDPOINT, offer);
  }
  removeJobOffer(id: number) {
    this.httpService.delete(
      Constants.BASE_URL + Constants.JOBS_ENDPOINT + '/' + id
    );
  }

  getJobOffers(): Observable<JobOffer[]> {
    return this.httpService.get(Constants.BASE_URL + Constants.JOBS_ENDPOINT);
  }

  getJobOfferById(id: number) {
    return this.httpService.get(
      Constants.BASE_URL + Constants.JOBS_ENDPOINT + '/' + id
    );
  }
  updateJobOffer(job: JobOfferViewDto) {
    return this.getJobOfferById(job.id!).pipe(
      switchMap((dbJob) => {
        dbJob!.likesCount = job.likesCount;
        dbJob!.categoryId = job.jobCategory;
        dbJob!.description = job.description;
        dbJob!.header = job.header;
        dbJob!.workTypeId = job.jobType;
        return this.httpService.put(
          Constants.BASE_URL + Constants.JOBS_ENDPOINT + '/' + dbJob.id,
          dbJob
        );
      })
    );
  }

  isLikedJob(jobId: number, userId: number) {
    const params: Param[] = [
      { name: 'jobId', value: jobId.toString() },
      { name: 'userId', value: userId.toString() },
    ];
    return this.httpService.get(
      Constants.BASE_URL + Constants.JOB_LIKES_ENDPOINT,
      params
    );
  }
  addJobLike(jobId: number, userId: number) {
    const jobLike: JobLike = new JobLike();
    jobLike.userId = userId;
    jobLike.jobId = jobId;
    return this.httpService.post(
      Constants.BASE_URL + Constants.JOB_LIKES_ENDPOINT,
      jobLike
    );
  }
  removeJobLike(jobId: number, userId: number) {
    console.log('uslo u delete');

    return this.isLikedJob(jobId, userId).pipe(
      tap((res: JobLike[]) => {
        console.log(res);

        this.httpService
          .delete(
            Constants.BASE_URL + Constants.JOB_LIKES_ENDPOINT + '/' + res[0].id
          )
          .subscribe((res) => console.log('uspeh?'));
      })
    );
  }
}
