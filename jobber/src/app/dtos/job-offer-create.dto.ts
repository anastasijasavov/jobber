import { JobCategory, JobType } from '../helper/helper';

export class JobOfferCreateDto {
  header?: string;
  description?: string;
  jobType?: JobType;
  jobCategory?: JobCategory;
}
