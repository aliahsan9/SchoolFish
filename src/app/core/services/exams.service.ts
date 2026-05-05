import { Injectable } from '@angular/core';
import { CreateExamRequest, Exam, UpdateExamRequest } from '../models/api.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ExamsService {
  constructor(private readonly api: ApiClientService) {}

  list() {
    return this.api.get<Exam[]>('Exams');
  }

  create(payload: CreateExamRequest) {
    return this.api.post<{ id: string }>('Exams', payload);
  }

  update(payload: UpdateExamRequest) {
    return this.api.put<void>(`Exams/${payload.id}`, payload);
  }

  delete(id: string) {
    return this.api.delete<void>(`Exams/${id}`);
  }
}
