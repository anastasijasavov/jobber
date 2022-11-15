import { UserType } from '../helper/helper';

export type User = {
  email: string;
  id: number;
  passwordHash: string;
  firstName: string;
  lastName: string;
  userTypeId: UserType;
  phoneNumber: string;
};
