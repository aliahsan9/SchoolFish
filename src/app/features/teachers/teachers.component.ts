import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Teacher } from '../../core/models/api.models';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { TeachersService } from '../../core/services/teachers.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>

    <div class="card border-0 shadow-sm mb-3" *ngIf="isAdmin">
      <div class="card-body">
        <h5>Create Teacher</h5>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="row g-2">
          <div class="col-md-3"><input class="form-control" placeholder="First name" formControlName="firstName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Last name" formControlName="lastName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Email" formControlName="email" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Phone" formControlName="phoneNumber" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Employee ID" formControlName="employeeId" /></div>
          <div class="col-md-3"><input type="date" class="form-control" formControlName="joiningDate" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Qualification" formControlName="qualification" /></div>
          <div class="col-md-3"><input type="number" class="form-control" placeholder="Experience Years" formControlName="experienceYears" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Initial Password" formControlName="initialPassword" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="createForm.invalid">Create</button></div>
        </form>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5>Teachers</h5>
        <table class="table table-striped mt-3">
          <thead><tr><th>Name</th><th>Email</th><th>Employee ID</th><th>Qualification</th><th>Exp</th><th class="text-end">{{ isAdmin ? 'Actions' : 'Access' }}</th></tr></thead>
          <tbody>
            <tr *ngFor="let t of teachers">
              <td>{{ t.fullName }}</td>
              <td>{{ t.email }}</td>
              <td>{{ t.employeeId }}</td>
              <td>{{ t.qualification }}</td>
              <td>{{ t.experienceYears }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" *ngIf="isAdmin" (click)="startEdit(t)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" *ngIf="isAdmin" (click)="remove(t.id)">Delete</button>
                <span class="text-muted" *ngIf="!isAdmin">View only</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card border-0 shadow-sm mt-3" *ngIf="isAdmin && editingTeacher">
      <div class="card-body">
        <h5>Edit Teacher</h5>
        <form [formGroup]="editForm" (ngSubmit)="update()" class="row g-2">
          <div class="col-md-3"><input class="form-control" placeholder="First name" formControlName="firstName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Last name" formControlName="lastName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Phone" formControlName="phoneNumber" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Employee ID" formControlName="employeeId" /></div>
          <div class="col-md-3"><input type="date" class="form-control" formControlName="joiningDate" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Qualification" formControlName="qualification" /></div>
          <div class="col-md-3"><input type="number" class="form-control" placeholder="Experience Years" formControlName="experienceYears" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="New Password (optional)" formControlName="newPassword" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="editForm.invalid">Save</button></div>
          <div class="col-md-3"><button type="button" class="btn btn-outline-secondary w-100" (click)="cancelEdit()">Cancel</button></div>
        </form>
      </div>
    </div>
  `
})
export class TeachersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);
  teachers: Teacher[] = [];
  editingTeacher: Teacher | null = null;
  successMessage = '';
  errorMessage = '';

  readonly createForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    initialPassword: ['Teacher@123', Validators.required],
    employeeId: ['', Validators.required],
    joiningDate: ['', Validators.required],
    qualification: ['', Validators.required],
    experienceYears: [0, Validators.required]
  });

  readonly editForm = this.fb.nonNullable.group({
    id: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: [''],
    employeeId: ['', Validators.required],
    joiningDate: ['', Validators.required],
    qualification: ['', Validators.required],
    experienceYears: [0, Validators.required],
    newPassword: ['']
  });

  constructor(private readonly teachersService: TeachersService) {}

  get isAdmin(): boolean {
    return (this.authStore.user()?.roles ?? []).some((r) => r.toLowerCase() === 'admin');
  }

  ngOnInit(): void {
    this.load();
  }

  create(): void {
    if (this.createForm.invalid) return;
    this.clearMessages();
    const value = this.createForm.getRawValue();
    this.teachersService
      .create({ ...value, phoneNumber: value.phoneNumber || null })
      .subscribe({
        next: () => {
          this.successMessage = 'Teacher created successfully.';
          this.load();
        },
        error: () => (this.errorMessage = 'Could not create teacher.')
      });
  }

  startEdit(teacher: Teacher): void {
    this.editingTeacher = teacher;
    const [firstName, ...rest] = teacher.fullName.split(' ');
    this.editForm.setValue({
      id: teacher.id,
      firstName: firstName ?? '',
      lastName: rest.join(' ') || '',
      phoneNumber: '',
      employeeId: teacher.employeeId,
      joiningDate: teacher.joiningDate?.substring(0, 10) ?? '',
      qualification: teacher.qualification,
      experienceYears: teacher.experienceYears,
      newPassword: ''
    });
  }

  cancelEdit(): void {
    this.editingTeacher = null;
  }

  update(): void {
    if (this.editForm.invalid) return;
    this.clearMessages();
    const value = this.editForm.getRawValue();
    this.teachersService
      .update({
        ...value,
        phoneNumber: value.phoneNumber || null,
        newPassword: value.newPassword || null
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Teacher updated successfully.';
          this.editingTeacher = null;
          this.load();
        },
        error: () => (this.errorMessage = 'Could not update teacher.')
      });
  }

  remove(id: string): void {
    this.clearMessages();
    this.teachersService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Teacher deleted successfully.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete teacher.')
    });
  }

  private load(): void {
    this.teachersService.list().subscribe({
      next: (data) => (this.teachers = data),
      error: () => (this.errorMessage = 'Could not load teachers.')
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
