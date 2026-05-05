import { Injectable } from '@angular/core';
import { RecordPaymentRequest, StudentFee } from '../models/api.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class FeesService {
  constructor(private readonly api: ApiClientService) {}

  getByStudent(studentId: string) {
    return this.api.get<StudentFee[]>(`Fees/by-student/${studentId}`);
  }

  recordPayment(payload: RecordPaymentRequest) {
    return this.api.post<{ paymentId: string }>('Fees/payments', payload);
  }
}
