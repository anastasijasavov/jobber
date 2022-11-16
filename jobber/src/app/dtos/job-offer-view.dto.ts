import { User } from '../models/user.model';
import { JobOfferCreateDto } from './job-offer-create.dto';

export class JobOfferViewDto extends JobOfferCreateDto {
  override likesCount: number;
  isLiked: boolean = false;
  id?: number;
  jobTypeName?: string;
  jobCategoryName?: string;
  candidates?: User[] = [];
  isApplied: boolean = false;
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
    this.workTypeId = jobType;
    this.categoryId = jobCat;
    this.likesCount = likesCount;
  }
}
