import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Student } from '../../core/models/api.models';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { StudentsService } from '../../core/services/students.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert alert-info" *ngIf="infoMessage">{{ infoMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
    <div class="card border-0 shadow-sm" *ngIf="student">
      <div class="card-body">
        <h5>My Profile</h5>
        <p class="mb-1"><b>Name:</b> {{ student.fullName }}</p>
        <p class="mb-1"><b>Email:</b> {{ student.email }}</p>
        <p class="mb-1"><b>Admission #:</b> {{ student.admissionNumber }}</p>
        <p class="mb-0"><b>Address:</b> {{ student.address }}</p>
      </div>
    </div>
    <div class="card border-0 shadow-sm" *ngIf="!student && auth.user()">
      <div class="card-body">
        <h5>My Account</h5>
        <p class="mb-1"><b>Name:</b> {{ auth.user()?.fullName }}</p>
        <p class="mb-1"><b>Email:</b> {{ auth.user()?.email }}</p>
        <p class="mb-0"><b>Roles:</b> {{ auth.user()?.roles?.join(', ') }}</p>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  student: Student | null = null;
  infoMessage = '';
  errorMessage = '';

  constructor(
    readonly auth: AuthStoreService,
    private readonly studentsService: StudentsService
  ) {}

  ngOnInit(): void {
    const isStudent = this.auth.user()?.roles?.some((role) => role.toLowerCase() === 'student');
    if (!isStudent) {
      this.infoMessage = 'Student profile endpoint is available for Student role only. Showing account details instead.';
      return;
    }

    this.studentsService.getMyProfile().subscribe({
      next: (data) => (this.student = data),
      error: () => {
        this.errorMessage = 'Could not load student profile.';
      }
    });
  }
}
