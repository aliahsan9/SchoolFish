import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { BillingService } from '../../core/services/billing.service';
import { ExamsService } from '../../core/services/exams.service';
import { StudentsService } from '../../core/services/students.service';
import { TeachersService } from '../../core/services/teachers.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert alert-warning" *ngIf="warningMessage">{{ warningMessage }}</div>
    <div class="row g-3">
      <div class="col-md-3" *ngFor="let item of stats">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <small class="text-muted">{{ item.label }}</small>
            <h3 class="mb-0">{{ item.value }}</h3>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  warningMessage = '';
  stats = [
    { label: 'Students', value: 0 },
    { label: 'Teachers', value: 0 },
    { label: 'Exams', value: 0 },
    { label: 'Subscription', value: 'N/A' as number | string }
  ];

  constructor(
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
    private readonly examsService: ExamsService,
    private readonly billingService: BillingService
  ) {}

  ngOnInit(): void {
    forkJoin({
      students: this.studentsService.getAll().pipe(catchError(() => of([]))),
      teachers: this.teachersService.list().pipe(catchError(() => of([]))),
      exams: this.examsService.list().pipe(catchError(() => of([]))),
      subscription: this.billingService.getSubscription().pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ students, teachers, exams, subscription }) => {
        this.stats = [
          { label: 'Students', value: students.length },
          { label: 'Teachers', value: teachers.length },
          { label: 'Exams', value: exams.length },
          { label: 'Subscription', value: subscription?.status ?? 'Unavailable' }
        ];
        if (!subscription) {
          this.warningMessage = 'Some dashboard data could not be loaded due to API permission or endpoint errors.';
        }
      }
    });
  }
}
