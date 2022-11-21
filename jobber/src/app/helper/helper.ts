import { HttpHeaders } from '@angular/common/http';

export interface Param {
  name: string;
  value: string;
}

export function generateHeaders() {
  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  return headers;
}

export enum UserType {
  Organization = 1,
  User = 2,
}

export enum JobType {
  FullTime = 1,
  PartTime = 2,
  Remote = 3,
}

export enum JobCategory {
  OfficeAdministration = 1,
  Development = 2,
  HR = 3,
}
