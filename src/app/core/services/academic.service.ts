import { Injectable } from '@angular/core';
import {
  AcademicCatalog,
  CreateAcademicYearRequest,
  CreateClassRequest,
  CreateSectionRequest,
  UpdateAcademicYearRequest,
  UpdateClassRequest,
  UpdateSectionRequest
} from '../models/api.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class AcademicService {
  constructor(private readonly api: ApiClientService) {}

  getCatalog() {
    return this.api.get<AcademicCatalog>('Academic/catalog');
  }

  createYear(payload: CreateAcademicYearRequest) {
    return this.api.post<{ id: string }>('Academic/years', payload);
  }

  updateYear(payload: UpdateAcademicYearRequest) {
    return this.api.put<void>(`Academic/years/${payload.id}`, payload);
  }

  deleteYear(id: string) {
    return this.api.delete<void>(`Academic/years/${id}`);
  }

  createClass(payload: CreateClassRequest) {
    return this.api.post<{ id: string }>('Academic/classes', payload);
  }

  updateClass(payload: UpdateClassRequest) {
    return this.api.put<void>(`Academic/classes/${payload.id}`, payload);
  }

  deleteClass(id: string) {
    return this.api.delete<void>(`Academic/classes/${id}`);
  }

  createSection(payload: CreateSectionRequest) {
    return this.api.post<{ id: string }>('Academic/sections', payload);
  }

  updateSection(payload: UpdateSectionRequest) {
    return this.api.put<void>(`Academic/sections/${payload.id}`, payload);
  }

  deleteSection(id: string) {
    return this.api.delete<void>(`Academic/sections/${id}`);
  }
}
