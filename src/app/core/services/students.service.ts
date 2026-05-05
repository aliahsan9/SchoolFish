import { Injectable } from '@angular/core';
import {
  CreateStudentRequest,
  EnrollStudentRequest,
  LinkParentRequest,
  PagedResult,
  Student,
  UpdateStudentRequest
} from '../models/api.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  constructor(private readonly api: ApiClientService) {}

  getAll() {
    return this.api.get<Student[]>('Students');
  }

  getPaged(params: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    classId?: string;
    sectionId?: string;
    sortBy?: string;
    sortDescending?: boolean;
  }) {
    return this.api.get<PagedResult<Student>>('Students/paged', params);
  }

  getById(id: string) {
    return this.api.get<Student>(`Students/${id}`);
  }

  getMyProfile() {
    return this.api.get<Student>('Students/me');
  }

  create(payload: CreateStudentRequest) {
    return this.api.post<string>('Students', payload);
  }

  update(payload: UpdateStudentRequest) {
    return this.api.put<void>(`Students/${payload.id}`, payload);
  }

  delete(id: string) {
    return this.api.delete<void>(`Students/${id}`);
  }

  enroll(studentId: string, payload: EnrollStudentRequest) {
    return this.api.post<{ enrollmentId: string }>(`Students/${studentId}/enrollments`, payload);
  }

  linkParent(studentId: string, payload: LinkParentRequest) {
    return this.api.post<void>(`Students/${studentId}/parents`, payload);
  }
}
