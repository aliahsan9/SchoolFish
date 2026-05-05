import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcademicCatalog, SectionItem } from '../../core/models/api.models';
import { AcademicService } from '../../core/services/academic.service';
import { AuthStoreService } from '../../core/services/auth-store.service';

@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
    <div class="alert alert-info" *ngIf="!isAdmin">You have read-only access to academic catalog.</div>

    <div class="row g-3">
      <div class="col-xl-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h6>Academic Years</h6>
            <form *ngIf="isAdmin" [formGroup]="yearForm" (ngSubmit)="saveYear()" class="row g-2 mb-3">
              <div class="col-12"><input class="form-control" placeholder="Year Name" formControlName="name" /></div>
              <div class="col-6"><input type="date" class="form-control" formControlName="startDate" /></div>
              <div class="col-6"><input type="date" class="form-control" formControlName="endDate" /></div>
              <div class="col-12 form-check ms-1">
                <input class="form-check-input" type="checkbox" formControlName="isActive" id="isYearActive" />
                <label class="form-check-label" for="isYearActive">Active year</label>
              </div>
              <div class="col-6"><button class="btn btn-brand w-100" [disabled]="yearForm.invalid">{{ editingYearId ? 'Update' : 'Add' }}</button></div>
              <div class="col-6"><button type="button" class="btn btn-outline-secondary w-100" (click)="resetYear()">Reset</button></div>
            </form>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let item of catalog?.academicYears">
                <span>{{ item.name }}</span>
                <div class="d-flex gap-2" *ngIf="isAdmin">
                  <button class="btn btn-sm btn-outline-secondary" (click)="editYear(item.id, item.name)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteYear(item.id)">Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h6>Classes</h6>
            <form *ngIf="isAdmin" [formGroup]="classForm" (ngSubmit)="saveClass()" class="row g-2 mb-3">
              <div class="col-12"><input class="form-control" placeholder="Class Name" formControlName="name" /></div>
              <div class="col-12"><input class="form-control" placeholder="Description" formControlName="description" /></div>
              <div class="col-6"><button class="btn btn-brand w-100" [disabled]="classForm.invalid">{{ editingClassId ? 'Update' : 'Add' }}</button></div>
              <div class="col-6"><button type="button" class="btn btn-outline-secondary w-100" (click)="resetClass()">Reset</button></div>
            </form>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let item of catalog?.classes">
                <span>{{ item.name }}</span>
                <div class="d-flex gap-2" *ngIf="isAdmin">
                  <button class="btn btn-sm btn-outline-secondary" (click)="editClass(item.id, item.name)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteClass(item.id)">Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h6>Sections</h6>
            <form *ngIf="isAdmin" [formGroup]="sectionForm" (ngSubmit)="saveSection()" class="row g-2 mb-3">
              <div class="col-12"><input class="form-control" placeholder="Section Name" formControlName="name" /></div>
              <div class="col-6"><input type="number" class="form-control" placeholder="Capacity" formControlName="capacity" /></div>
              <div class="col-6">
                <select class="form-select" formControlName="classId">
                  <option value="">Class</option>
                  <option *ngFor="let c of catalog?.classes" [value]="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="col-6"><button class="btn btn-brand w-100" [disabled]="sectionForm.invalid">{{ editingSectionId ? 'Update' : 'Add' }}</button></div>
              <div class="col-6"><button type="button" class="btn btn-outline-secondary w-100" (click)="resetSection()">Reset</button></div>
            </form>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let item of catalog?.sections">
                <span>{{ item.name }}</span>
                <div class="d-flex gap-2" *ngIf="isAdmin">
                  <button class="btn btn-sm btn-outline-secondary" (click)="editSection(item)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteSection(item.id)">Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AcademicComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);
  catalog: AcademicCatalog | null = null;
  errorMessage = '';
  successMessage = '';

  editingYearId: string | null = null;
  editingClassId: string | null = null;
  editingSectionId: string | null = null;

  readonly yearForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isActive: [true, Validators.required]
  });

  readonly classForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  readonly sectionForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    capacity: [40, Validators.required],
    classId: ['', Validators.required]
  });

  constructor(private readonly academicService: AcademicService) {}

  get isAdmin(): boolean {
    return (this.authStore.user()?.roles ?? []).some((r) => r.toLowerCase() === 'admin');
  }

  ngOnInit(): void {
    this.load();
  }

  saveYear(): void {
    if (this.yearForm.invalid) return;
    this.clearMessages();
    if (this.editingYearId) {
      this.academicService.updateYear({ id: this.editingYearId, ...this.yearForm.getRawValue() }).subscribe({
        next: () => {
          this.successMessage = 'Academic year updated.';
          this.resetYear();
          this.load();
        },
        error: () => (this.errorMessage = 'Could not update academic year.')
      });
      return;
    }

    this.academicService.createYear(this.yearForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Academic year created.';
        this.resetYear();
        this.load();
      },
      error: () => (this.errorMessage = 'Could not create academic year.')
    });
  }

  editYear(id: string, name: string): void {
    this.editingYearId = id;
    this.yearForm.patchValue({ name });
  }

  deleteYear(id: string): void {
    this.clearMessages();
    this.academicService.deleteYear(id).subscribe({
      next: () => {
        this.successMessage = 'Academic year deleted.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete academic year.')
    });
  }

  resetYear(): void {
    this.editingYearId = null;
    this.yearForm.reset({ name: '', startDate: '', endDate: '', isActive: true });
  }

  saveClass(): void {
    if (this.classForm.invalid) return;
    this.clearMessages();
    const value = this.classForm.getRawValue();
    if (this.editingClassId) {
      this.academicService
        .updateClass({ id: this.editingClassId, name: value.name, description: value.description || null })
        .subscribe({
          next: () => {
            this.successMessage = 'Class updated.';
            this.resetClass();
            this.load();
          },
          error: () => (this.errorMessage = 'Could not update class.')
        });
      return;
    }

    this.academicService.createClass({ name: value.name, description: value.description || null }).subscribe({
      next: () => {
        this.successMessage = 'Class created.';
        this.resetClass();
        this.load();
      },
      error: () => (this.errorMessage = 'Could not create class.')
    });
  }

  editClass(id: string, name: string): void {
    this.editingClassId = id;
    this.classForm.patchValue({ name });
  }

  deleteClass(id: string): void {
    this.clearMessages();
    this.academicService.deleteClass(id).subscribe({
      next: () => {
        this.successMessage = 'Class deleted.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete class.')
    });
  }

  resetClass(): void {
    this.editingClassId = null;
    this.classForm.reset({ name: '', description: '' });
  }

  saveSection(): void {
    if (this.sectionForm.invalid) return;
    this.clearMessages();
    if (this.editingSectionId) {
      this.academicService.updateSection({ id: this.editingSectionId, ...this.sectionForm.getRawValue() }).subscribe({
        next: () => {
          this.successMessage = 'Section updated.';
          this.resetSection();
          this.load();
        },
        error: () => (this.errorMessage = 'Could not update section.')
      });
      return;
    }

    this.academicService.createSection(this.sectionForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Section created.';
        this.resetSection();
        this.load();
      },
      error: () => (this.errorMessage = 'Could not create section.')
    });
  }

  editSection(item: SectionItem): void {
    this.editingSectionId = item.id;
    this.sectionForm.patchValue({ name: item.name, classId: item.classId, capacity: item.capacity ?? 40 });
  }

  deleteSection(id: string): void {
    this.clearMessages();
    this.academicService.deleteSection(id).subscribe({
      next: () => {
        this.successMessage = 'Section deleted.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete section.')
    });
  }

  resetSection(): void {
    this.editingSectionId = null;
    this.sectionForm.reset({ name: '', classId: '', capacity: 40 });
  }

  private load(): void {
    this.academicService.getCatalog().subscribe({
      next: (data) => (this.catalog = data),
      error: () => (this.errorMessage = 'Could not load academic catalog.')
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
