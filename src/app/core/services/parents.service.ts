import { Injectable } from '@angular/core';
import { CreateParentRequest, ParentItem, UpdateParentRequest } from '../models/api.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class ParentsService {
  constructor(private readonly api: ApiClientService) {}

  create(payload: CreateParentRequest) {
    return this.api.post<{ id: string }>('Parents', payload);
  }

  list() {
    return this.api.get<ParentItem[]>('Parents');
  }

  update(payload: UpdateParentRequest) {
    return this.api.put<void>(`Parents/${payload.id}`, payload);
  }

  delete(id: string) {
    return this.api.delete<void>(`Parents/${id}`);
  }
}
