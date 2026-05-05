import { Injectable } from '@angular/core';
import { PaySubscriptionRequest, SchoolSubscription } from '../models/api.models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class BillingService {
  constructor(private readonly api: ApiClientService) {}

  getSubscription() {
    return this.api.get<SchoolSubscription>('Billing/subscription');
  }

  paySubscription(payload: PaySubscriptionRequest) {
    return this.api.post<SchoolSubscription>('Billing/subscription/pay', payload);
  }
}
