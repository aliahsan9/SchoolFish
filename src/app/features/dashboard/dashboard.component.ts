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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  warningMessage = '';
  loading = true;

  stats = [
    { label: 'Students', value: 0, icon: '🎓', color: '#4facfe' },
    { label: 'Teachers', value: 0, icon: '👨‍🏫', color: '#43e97b' },
    { label: 'Exams', value: 0, icon: '📝', color: '#fa709a' },
    { label: 'Subscription', value: 'N/A' as number | string, icon: '💳', color: '#f6d365' }
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
          { label: 'Students', value: students.length, icon: '🎓', color: '#4facfe' },
          { label: 'Teachers', value: teachers.length, icon: '👨‍🏫', color: '#43e97b' },
          { label: 'Exams', value: exams.length, icon: '📝', color: '#fa709a' },
          { label: 'Subscription', value: subscription?.status ?? 'Unavailable', icon: '💳', color: '#f6d365' }
        ];

        if (!subscription) {
          this.warningMessage =
            'Some dashboard data could not be loaded due to API permission or endpoint errors.';
        }

        this.loading = false;
      }
    });
  }
}