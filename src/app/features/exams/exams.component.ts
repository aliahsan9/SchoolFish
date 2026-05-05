import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcademicCatalog, Exam } from '../../core/models/api.models';
import { AcademicService } from '../../core/services/academic.service';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { ExamsService } from '../../core/services/exams.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>

    <div class="card border-0 shadow-sm mb-3" *ngIf="isAdmin">
      <div class="card-body">
        <h5>Create Exam</h5>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="row g-2">
          <div class="col-md-4"><input class="form-control" placeholder="Exam Name" formControlName="name" /></div>
          <div class="col-md-4">
            <select class="form-select" formControlName="academicYearId">
              <option value="">Academic Year</option>
              <option *ngFor="let y of catalog?.academicYears" [value]="y.id">{{ y.name }}</option>
            </select>
          </div>
          <div class="col-md-2"><input type="date" class="form-control" formControlName="startDate" /></div>
          <div class="col-md-2"><input type="date" class="form-control" formControlName="endDate" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="createForm.invalid">Create</button></div>
        </form>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5>Exams</h5>
        <table class="table mt-3">
          <thead><tr><th>Name</th><th>Start</th><th>End</th><th>Academic Year</th><th class="text-end">{{ isAdmin ? 'Actions' : 'Access' }}</th></tr></thead>
          <tbody>
            <tr *ngFor="let exam of exams">
              <td>{{ exam.name }}</td>
              <td>{{ exam.startDate | date }}</td>
              <td>{{ exam.endDate | date }}</td>
              <td>{{ exam.academicYear }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" *ngIf="isAdmin" (click)="startEdit(exam)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" *ngIf="isAdmin" (click)="remove(exam.id)">Delete</button>
                <span class="text-muted" *ngIf="!isAdmin">View only</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card border-0 shadow-sm mt-3" *ngIf="isAdmin && editingExam">
      <div class="card-body">
        <h5>Edit Exam</h5>
        <form [formGroup]="editForm" (ngSubmit)="update()" class="row g-2">
          <div class="col-md-4"><input class="form-control" placeholder="Exam Name" formControlName="name" /></div>
          <div class="col-md-4">
            <select class="form-select" formControlName="academicYearId">
              <option value="">Academic Year</option>
              <option *ngFor="let y of catalog?.academicYears" [value]="y.id">{{ y.name }}</option>
            </select>
          </div>
          <div class="col-md-2"><input type="date" class="form-control" formControlName="startDate" /></div>
          <div class="col-md-2"><input type="date" class="form-control" formControlName="endDate" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="editForm.invalid">Save</button></div>
          <div class="col-md-3"><button type="button" class="btn btn-outline-secondary w-100" (click)="cancelEdit()">Cancel</button></div>
        </form>
      </div>
    </div>
  `
})
export class ExamsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);
  exams: Exam[] = [];
  editingExam: Exam | null = null;
  catalog: AcademicCatalog | null = null;
  successMessage = '';
  errorMessage = '';

  readonly createForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    academicYearId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  readonly editForm = this.fb.nonNullable.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    academicYearId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  constructor(
    private readonly examsService: ExamsService,
    private readonly academicService: AcademicService
  ) {}

  get isAdmin(): boolean {
    return (this.authStore.user()?.roles ?? []).some((r) => r.toLowerCase() === 'admin');
  }

  ngOnInit(): void {
    this.load();
    this.academicService.getCatalog().subscribe({ next: (data) => (this.catalog = data) });
  }

  create(): void {
    if (this.createForm.invalid) return;
    this.clearMessages();
    this.examsService.create(this.createForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Exam created successfully.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not create exam.')
    });
  }

  startEdit(exam: Exam): void {
    this.editingExam = exam;
    this.editForm.setValue({
      id: exam.id,
      name: exam.name,
      academicYearId: exam.academicYearId ?? '',
      startDate: exam.startDate.substring(0, 10),
      endDate: exam.endDate.substring(0, 10)
    });
  }

  cancelEdit(): void {
    this.editingExam = null;
  }

  update(): void {
    if (this.editForm.invalid) return;
    this.clearMessages();
    this.examsService.update(this.editForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Exam updated successfully.';
        this.editingExam = null;
        this.load();
      },
      error: () => (this.errorMessage = 'Could not update exam.')
    });
  }

  remove(id: string): void {
    this.clearMessages();
    this.examsService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Exam deleted successfully.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete exam.')
    });
  }

  private load(): void {
    this.examsService.list().subscribe({
      next: (data) => (this.exams = data),
      error: () => (this.errorMessage = 'Could not load exams.')
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
