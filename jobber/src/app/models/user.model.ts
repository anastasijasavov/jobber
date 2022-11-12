import { UserType } from '../helper/helper';

export class User {
  email?: string;
  id?: number;
  passwordHash?: string;
  name?: string;
  userTypeId?: UserType;
}
