import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentFee } from '../../core/models/api.models';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { FeesService } from '../../core/services/fees.service';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
    <div class="row g-3">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm" *ngIf="isAdmin">
          <div class="card-body">
            <h5>Get Fees by Student</h5>
            <form [formGroup]="studentForm" (ngSubmit)="loadFees()" class="d-flex gap-2 mt-2">
              <input class="form-control" placeholder="Student ID" formControlName="studentId" />
              <button class="btn btn-brand">Load</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5>Record Payment</h5>
            <form [formGroup]="paymentForm" (ngSubmit)="recordPayment()" class="row g-2 mt-2">
              <div class="col-12"><input class="form-control" placeholder="Student Fee ID" formControlName="studentFeeId" /></div>
              <div class="col-6"><input type="number" class="form-control" placeholder="Amount Paid" formControlName="amountPaid" /></div>
              <div class="col-6"><input class="form-control" placeholder="Method (Cash/Card)" formControlName="paymentMethod" /></div>
              <div class="col-12"><button class="btn btn-brand w-100" [disabled]="paymentForm.invalid">Submit Payment</button></div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5>Fee Records</h5>
            <table class="table mt-2">
              <thead><tr><th>Due</th><th>Amount</th><th>Paid</th><th>Status</th></tr></thead>
              <tbody><tr *ngFor="let fee of fees"><td>{{ fee.dueDate | date }}</td><td>{{ fee.amount }}</td><td>{{ fee.totalPaid }}</td><td>{{ fee.status }}</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);
  fees: StudentFee[] = [];
  successMessage = '';
  errorMessage = '';
  readonly studentForm = this.fb.nonNullable.group({ studentId: ['', Validators.required] });
  readonly paymentForm = this.fb.nonNullable.group({
    studentFeeId: ['', Validators.required],
    amountPaid: [0, Validators.required],
    paymentMethod: ['Cash', Validators.required]
  });

  constructor(private readonly feesService: FeesService) {}

  get isAdmin(): boolean {
    return (this.authStore.user()?.roles ?? []).some((r) => r.toLowerCase() === 'admin');
  }

  loadFees(): void {
    if (this.studentForm.invalid) return;
    this.successMessage = '';
    this.errorMessage = '';
    this.feesService.getByStudent(this.studentForm.getRawValue().studentId).subscribe({
      next: (data) => (this.fees = data),
      error: () => (this.errorMessage = 'Could not load fee records for this student.')
    });
  }

  recordPayment(): void {
    if (this.paymentForm.invalid) return;
    this.successMessage = '';
    this.errorMessage = '';
    this.feesService.recordPayment(this.paymentForm.getRawValue()).subscribe({
      next: () => (this.successMessage = 'Payment recorded successfully.'),
      error: () => (this.errorMessage = 'Could not record payment.')
    });
  }
}
