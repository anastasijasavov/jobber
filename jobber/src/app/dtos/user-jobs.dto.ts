import { JobOfferViewDto } from './job-offer-view.dto';

export class UserJobsDto extends JobOfferViewDto {
  appliedAt?: Date;
  userId?: number;
  isApproved?: boolean;
}
