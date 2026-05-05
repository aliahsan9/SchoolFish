import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student, UpdateStudentRequest } from '../../core/models/api.models';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { AcademicService } from '../../core/services/academic.service';
import { StudentsService } from '../../core/services/students.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>

    <div class="card border-0 shadow-sm mb-3" *ngIf="isAdmin">
      <div class="card-body">
        <h5>Create Student</h5>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="row g-2">
          <div class="col-md-3"><input class="form-control" placeholder="First Name" formControlName="firstName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Last Name" formControlName="lastName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Email" formControlName="email" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Admission #" formControlName="admissionNumber" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Initial Password" formControlName="initialPassword" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Phone" formControlName="phoneNumber" /></div>
          <div class="col-md-2"><input type="date" class="form-control" formControlName="dob" /></div>
          <div class="col-md-2"><input class="form-control" placeholder="Gender" formControlName="gender" /></div>
          <div class="col-md-2"><input class="form-control" placeholder="Blood Group" formControlName="bloodGroup" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="School Id (optional)" formControlName="schoolId" /></div>
          <div class="col-md-12"><input class="form-control" placeholder="Address" formControlName="address" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="createForm.invalid">Create</button></div>
        </form>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-3" *ngIf="isAdmin && selectedStudentId">
      <div class="card-body">
        <h5>Enrollment & Parent Link</h5>
        <div class="row g-3">
          <div class="col-lg-7">
            <form [formGroup]="enrollForm" (ngSubmit)="enrollSelected()" class="row g-2">
              <div class="col-md-6">
                <select class="form-select" formControlName="academicYearId">
                  <option value="">Academic year</option>
                  <option *ngFor="let item of catalog?.academicYears" [value]="item.id">{{ item.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <select class="form-select" formControlName="classId">
                  <option value="">Class</option>
                  <option *ngFor="let item of catalog?.classes" [value]="item.id">{{ item.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <select class="form-select" formControlName="sectionId">
                  <option value="">Section</option>
                  <option *ngFor="let item of filteredSections" [value]="item.id">{{ item.name }}</option>
                </select>
              </div>
              <div class="col-md-6"><input class="form-control" placeholder="Roll Number" formControlName="rollNumber" /></div>
              <div class="col-md-4"><button class="btn btn-outline-primary w-100" [disabled]="enrollForm.invalid">Enroll Selected Student</button></div>
            </form>
          </div>
          <div class="col-lg-5">
            <form [formGroup]="linkParentForm" (ngSubmit)="linkParentToSelected()" class="row g-2">
              <div class="col-12"><input class="form-control" placeholder="Parent Id" formControlName="parentId" /></div>
              <div class="col-12"><input class="form-control" placeholder="Relation (Father/Mother/Guardian)" formControlName="relation" /></div>
              <div class="col-12"><button class="btn btn-outline-secondary w-100" [disabled]="linkParentForm.invalid">Link Parent</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Students</h5>
          <button class="btn btn-sm btn-outline-dark" (click)="load()">Refresh</button>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead><tr><th>Name</th><th>Email</th><th>Admission</th><th>Gender</th><th class="text-end">{{ isAdmin ? 'Actions' : 'Manage' }}</th></tr></thead>
            <tbody>
              <tr *ngFor="let s of students" [class.table-active]="selectedStudentId === s.id">
                <td>{{ s.fullName }}</td>
                <td>{{ s.email }}</td>
                <td>{{ s.admissionNumber }}</td>
                <td>{{ s.gender }}</td>
                <td class="text-end d-flex gap-2 justify-content-end">
                  <button class="btn btn-sm btn-outline-primary" *ngIf="isAdmin" (click)="selectForManage(s)">Manage</button>
                  <button class="btn btn-sm btn-outline-secondary" *ngIf="isAdmin" (click)="startEdit(s)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" *ngIf="isAdmin" (click)="remove(s.id)">Delete</button>
                  <span class="text-muted" *ngIf="!isAdmin">View only</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mt-3" *ngIf="isAdmin && editingStudent">
      <div class="card-body">
        <h5>Edit Student</h5>
        <form [formGroup]="editForm" (ngSubmit)="update()" class="row g-2">
          <div class="col-md-3"><input class="form-control" placeholder="First Name" formControlName="firstName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Last Name" formControlName="lastName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Admission #" formControlName="admissionNumber" /></div>
          <div class="col-md-3"><input type="date" class="form-control" formControlName="dob" /></div>
          <div class="col-md-2"><input class="form-control" placeholder="Gender" formControlName="gender" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Phone" formControlName="phoneNumber" /></div>
          <div class="col-md-2"><input class="form-control" placeholder="Blood Group" formControlName="bloodGroup" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="New Password (optional)" formControlName="newPassword" /></div>
          <div class="col-md-12"><input class="form-control" placeholder="Address" formControlName="address" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="editForm.invalid">Save Changes</button></div>
          <div class="col-md-3"><button type="button" class="btn btn-outline-secondary w-100" (click)="cancelEdit()">Cancel</button></div>
        </form>
      </div>
    </div>
  `
})
export class StudentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);
  students: Student[] = [];
  selectedStudentId: string | null = null;
  editingStudent: Student | null = null;
  successMessage = '';
  errorMessage = '';
  catalog: { academicYears: { id: string; name: string }[]; classes: { id: string; name: string }[]; sections: { id: string; name: string; classId: string }[] } | null = null;

  readonly createForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    initialPassword: ['P@ssw0rd1', Validators.required],
    admissionNumber: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['Male', Validators.required],
    address: ['', Validators.required],
    bloodGroup: [''],
    schoolId: ['']
  });

  readonly editForm = this.fb.nonNullable.group({
    id: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: [''],
    admissionNumber: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    address: ['', Validators.required],
    bloodGroup: [''],
    newPassword: ['']
  });

  readonly enrollForm = this.fb.nonNullable.group({
    classId: ['', Validators.required],
    sectionId: ['', Validators.required],
    academicYearId: ['', Validators.required],
    rollNumber: ['', Validators.required]
  });

  readonly linkParentForm = this.fb.nonNullable.group({
    parentId: ['', Validators.required],
    relation: ['', Validators.required]
  });

  get filteredSections() {
    const classId = this.enrollForm.controls.classId.value;
    return this.catalog?.sections.filter((s) => s.classId === classId) ?? [];
  }

  get isAdmin(): boolean {
    return (this.authStore.user()?.roles ?? []).some((r) => r.toLowerCase() === 'admin');
  }

  constructor(
    private readonly studentsService: StudentsService,
    private readonly academicService: AcademicService
  ) {}

  ngOnInit(): void {
    this.load();
    this.academicService.getCatalog().subscribe({ next: (data) => (this.catalog = data) });
  }

  create(): void {
    if (this.createForm.invalid) return;
    this.clearMessages();
    const value = this.createForm.getRawValue();
    this.studentsService
      .create({
        ...value,
        phoneNumber: value.phoneNumber || null,
        bloodGroup: value.bloodGroup || null,
        schoolId: value.schoolId || null
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Student created successfully.';
          this.createForm.patchValue({ schoolId: '' });
          this.load();
        },
        error: () => (this.errorMessage = 'Could not create student.')
      });
  }

  startEdit(student: Student): void {
    this.clearMessages();
    this.editingStudent = student;
    const [firstName, ...rest] = student.fullName.split(' ');
    this.editForm.setValue({
      id: student.id,
      firstName: firstName ?? '',
      lastName: rest.join(' ') || '',
      phoneNumber: student.phoneNumber ?? '',
      admissionNumber: student.admissionNumber,
      dob: student.dob.substring(0, 10),
      gender: student.gender,
      address: student.address,
      bloodGroup: student.bloodGroup ?? '',
      newPassword: ''
    });
  }

  cancelEdit(): void {
    this.editingStudent = null;
  }

  update(): void {
    if (this.editForm.invalid) return;
    this.clearMessages();
    const value = this.editForm.getRawValue();
    const payload: UpdateStudentRequest = {
      ...value,
      phoneNumber: value.phoneNumber || null,
      bloodGroup: value.bloodGroup || null,
      newPassword: value.newPassword || null
    };
    this.studentsService.update(payload).subscribe({
      next: () => {
        this.successMessage = 'Student updated successfully.';
        this.editingStudent = null;
        this.load();
      },
      error: () => (this.errorMessage = 'Could not update student.')
    });
  }

  remove(id: string): void {
    this.clearMessages();
    this.studentsService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Student deleted successfully.';
        if (this.selectedStudentId === id) {
          this.selectedStudentId = null;
        }
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete student.')
    });
  }

  selectForManage(student: Student): void {
    this.selectedStudentId = student.id;
  }

  enrollSelected(): void {
    if (!this.selectedStudentId || this.enrollForm.invalid) return;
    this.clearMessages();
    this.studentsService.enroll(this.selectedStudentId, this.enrollForm.getRawValue()).subscribe({
      next: () => (this.successMessage = 'Student enrolled successfully.'),
      error: () => (this.errorMessage = 'Could not enroll selected student.')
    });
  }

  linkParentToSelected(): void {
    if (!this.selectedStudentId || this.linkParentForm.invalid) return;
    this.clearMessages();
    this.studentsService.linkParent(this.selectedStudentId, this.linkParentForm.getRawValue()).subscribe({
      next: () => (this.successMessage = 'Parent linked successfully.'),
      error: () => (this.errorMessage = 'Could not link parent.')
    });
  }

  load(): void {
    this.studentsService.getAll().subscribe({
      next: (data) => (this.students = data),
      error: () => (this.errorMessage = 'Could not load students.')
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
