import { JobOfferCreateDto } from './job-offer-create.dto';

export class JobOfferViewDto extends JobOfferCreateDto {
  likesCount?: number;
  isLiked: boolean = false;
  id?: number;
  constructor(
    id: number,
    header: string,
    desc: string,
    jobType: number,
    jobCat: number,
    likesCount: number
  ) {
    super();
    this.id = id;
    this.header = header;
    this.description = desc;
    this.jobType = jobType;
    this.jobCategory = jobCat;
    this.likesCount = likesCount;
  }
}
