import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SchoolSubscription } from '../../core/models/api.models';
import { BillingService } from '../../core/services/billing.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
    <div class="row g-3">
      <div class="col-lg-7">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5>Current Subscription</h5>
            <ng-container *ngIf="subscription; else empty">
              <p class="mb-1"><b>Status:</b> {{ subscription.status }}</p>
              <p class="mb-1"><b>Plan:</b> {{ subscription.plan }}</p>
              <p class="mb-1"><b>Monthly:</b> {{ subscription.monthlyPrice }}</p>
              <p class="mb-0"><b>Yearly:</b> {{ subscription.yearlyPrice }}</p>
            </ng-container>
            <ng-template #empty><p class="text-muted mb-0">No subscription found.</p></ng-template>
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5>Pay Subscription</h5>
            <form [formGroup]="form" (ngSubmit)="submit()" class="row g-2">
              <div class="col-12">
                <select class="form-select" formControlName="yearlyPremium">
                  <option [ngValue]="false">Monthly</option>
                  <option [ngValue]="true">Yearly Premium</option>
                </select>
              </div>
              <div class="col-12"><input class="form-control" formControlName="paymentMethod" placeholder="Payment Method" /></div>
              <div class="col-12"><button class="btn btn-brand w-100">Pay</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BillingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  subscription: SchoolSubscription | null = null;
  successMessage = '';
  errorMessage = '';
  readonly form = this.fb.nonNullable.group({
    yearlyPremium: false,
    paymentMethod: 'Card'
  });

  constructor(private readonly billingService: BillingService) {}

  ngOnInit(): void {
    this.load();
  }

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.billingService.paySubscription(this.form.getRawValue()).subscribe({
      next: (data) => {
        this.subscription = data;
        this.successMessage = 'Subscription payment completed.';
      },
      error: () => (this.errorMessage = 'Could not process subscription payment.')
    });
  }

  private load(): void {
    this.billingService.getSubscription().subscribe({
      next: (data) => (this.subscription = data),
      error: () => (this.errorMessage = 'Could not load subscription details.')
    });
  }
}
