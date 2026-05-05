import { Injectable } from '@angular/core';
import { CreateTeacherRequest, Teacher, UpdateTeacherRequest } from '../models/api.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class TeachersService {
  constructor(private readonly api: ApiClientService) {}

  list() {
    return this.api.get<Teacher[]>('Teachers');
  }

  create(payload: CreateTeacherRequest) {
    return this.api.post<{ id: string }>('Teachers', payload);
  }

  update(payload: UpdateTeacherRequest) {
    return this.api.put<void>(`Teachers/${payload.id}`, payload);
  }

  delete(id: string) {
    return this.api.delete<void>(`Teachers/${id}`);
  }
}
