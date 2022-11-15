import { UserType } from '../helper/helper';

export class UserCreateDto {
  email?: string;
  password?: string;
  userTypeId?: UserType;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
