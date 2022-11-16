import { Injectable } from '@angular/core';
import {
  first,
  from,
  map,
  mergeMap,
  Observable,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { Constants } from '../app.constants';
import { JobOfferCreateDto } from '../dtos/job-offer-create.dto';
import { JobOfferViewDto } from '../dtos/job-offer-view.dto';
import { Param } from '../helper/helper';
import { JobCategory } from '../models/job-category.model';
import { JobLike } from '../models/job-like.model';
import { JobOffer } from '../models/job-offer.model';
import { JobType } from '../models/job-type.model';
import { UserJob } from '../models/user-job.model';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root',
})
export class JobOfferService {
  constructor(private httpService: HttpUtilsService) {}

  addJobOffer(offer: JobOfferCreateDto) {
    return this.httpService.post(
      Constants.BASE_URL + Constants.JOBS_ENDPOINT,
      offer
    );
  }
  removeJobOffer(id: number) {
    this.httpService.delete(
      Constants.BASE_URL + Constants.JOBS_ENDPOINT + '/' + id
    );
  }

  removeJobOffers(createdBy: number) {
    //first delete related candidates for the job and then the jobs for the specified user
    this.getJobsByOrganization(createdBy)
      .pipe(
        switchMap((res: JobOffer[]) => from(res)),
        mergeMap((res: JobOffer) => this.removeUserJobs({ jobId: res.id }))
      )
      .subscribe((res) => {
        return this.httpService.delete(
          Constants.BASE_URL +
            Constants.JOBS_ENDPOINT +
            '?createdBy=' +
            createdBy
        );
      });
  }

  getJobOffers(): Observable<JobOffer[]> {
    return this.httpService.get(Constants.BASE_URL + Constants.JOBS_ENDPOINT);
  }

  getJobOfferById(id: number): Observable<JobOffer> {
    return this.httpService
      .get<JobOffer>(Constants.BASE_URL + Constants.JOBS_ENDPOINT + '/' + id)
      .pipe(first());
  }
  updateJobOffer(job: JobOfferViewDto) {
    return this.getJobOfferById(job.id!).pipe(
      switchMap((dbJob) => {
        dbJob!.likesCount = job.likesCount;
        dbJob!.categoryId = job.categoryId;
        dbJob!.description = job.description;
        dbJob!.header = job.header;
        dbJob!.workTypeId = job.workTypeId;
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
    return this.httpService.get<JobLike[]>(
      Constants.BASE_URL + Constants.JOB_LIKES_ENDPOINT,
      params
    );
  }
  isAppliedForJob(jobId: number, userId: number) {
    const params: Param[] = [
      { name: 'jobId', value: jobId.toString() },
      { name: 'userId', value: userId.toString() },
    ];
    return this.httpService.get<UserJob[]>(
      Constants.BASE_URL + Constants.USER_JOBS_ENDPOINT,
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
    return this.isLikedJob(jobId, userId).pipe(
      tap((res: JobLike[]) => {
        this.httpService
          .delete(
            Constants.BASE_URL + Constants.JOB_LIKES_ENDPOINT + '/' + res[0].id
          )
          .subscribe();
      })
    );
  }

  applyForJob(id: number, jobId: number) {
    const userJob = {
      userId: id,
      jobId: jobId,
      appliedAt: new Date(),
      isApproved: null,
    };
    return this.httpService.post(
      Constants.BASE_URL + Constants.USER_JOBS_ENDPOINT,
      userJob
    );
  }

  getMyJobs(userId: number) {
    const params: Param[] = [{ name: 'userId', value: userId.toString() }];
    const userJobs$ = this.httpService.get<UserJob[]>(
      Constants.BASE_URL + Constants.USER_JOBS_ENDPOINT,
      params
    );
    return userJobs$;
  }

  getJobTypes(id?: number) {
    return this.httpService.get<JobType[]>(
      Constants.BASE_URL + Constants.WORK_TYPES_ENDPOINT + (id ? +'/' + id : '')
    );
  }
  getJobCategories(id?: number) {
    return this.httpService.get<JobCategory[]>(
      Constants.BASE_URL + Constants.CATEGORIES_ENDPOINT + (id ? +'/' + id : '')
    );
  }

  getJobsByOrganization(orgId: number) {
    const params: Param[] = [{ name: 'createdBy', value: orgId.toString() }];
    return this.httpService.get<JobOffer[]>(
      Constants.BASE_URL + Constants.JOBS_ENDPOINT,
      params
    );
  }

  getCandidatesByJob(jobId: number) {
    const params: Param[] = [{ name: 'jobId', value: jobId.toString() }];
    return this.httpService.get<UserJob[]>(
      Constants.BASE_URL + Constants.USER_JOBS_ENDPOINT,
      params
    );
  }

  getUserJob(userId: number, jobId: number) {
    const params: Param[] = [
      { name: 'userId', value: userId.toString() },
      { name: 'jobId', value: jobId.toString() },
    ];
    return this.httpService.get<UserJob[]>(
      Constants.BASE_URL + Constants.USER_JOBS_ENDPOINT,
      params
    );
  }
  updateUserJob(userJobId: number, userJob: UserJob) {
    return this.httpService.put<UserJob>(
      Constants.BASE_URL + Constants.USER_JOBS_ENDPOINT + '/' + userJobId,
      userJob
    );
  }

  removeUserJobs(jobParams: UserJob) {
    const param: Param = { name: '', value: '' };
    if (jobParams.jobId) {
      param.name = 'jobId';
      param.value = jobParams.jobId.toString();
    } else if (jobParams.userId) {
      param.name = 'userId';
      param.value = jobParams.userId.toString();
    }
    return this.httpService.delete<UserJob>(
      Constants.BASE_URL +
        Constants.USER_JOBS_ENDPOINT +
        '?' +
        param.name +
        '=' +
        param.value
    );
  }
}
