import { JobCategory, JobType } from '../helper/helper';

export class JobOfferCreateDto {
  header?: string;
  description?: string;
  workTypeId?: JobType;
  categoryId?: JobCategory;
  createdBy?: number;
  likesCount = 0;
}
