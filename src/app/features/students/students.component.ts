import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Student, UpdateStudentRequest } from '../../core/models/api.models';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { AcademicService } from '../../core/services/academic.service';
import { StudentsService } from '../../core/services/students.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);

  students: Student[] = [];
  selectedStudentId: string | null = null;
  editingStudent: Student | null = null;

  successMessage = '';
  errorMessage = '';

  activeTab = signal<'list' | 'create' | 'manage'>('list');

  catalog: any = null;

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

  constructor(
    private readonly studentsService: StudentsService,
    private readonly academicService: AcademicService
  ) {}

  get isAdmin(): boolean {
    return (this.authStore.user()?.roles ?? []).some(r => r.toLowerCase() === 'admin');
  }

  get filteredSections() {
    const classId = this.enrollForm.controls.classId.value;
    return this.catalog?.sections.filter((s: any) => s.classId === classId) ?? [];
  }

  ngOnInit(): void {
    this.load();
    this.academicService.getCatalog().subscribe({
      next: (data) => (this.catalog = data)
    });
  }

  /* ===== UI SWITCH ===== */
  setTab(tab: 'list' | 'create' | 'manage') {
    this.activeTab.set(tab);
  }

  /* ===== ALL YOUR ORIGINAL LOGIC (UNCHANGED) ===== */

  create(): void {
    if (this.createForm.invalid) return;
    this.clearMessages();

    const value = this.createForm.getRawValue();

    this.studentsService.create({
      ...value,
      phoneNumber: value.phoneNumber || null,
      bloodGroup: value.bloodGroup || null,
      schoolId: value.schoolId || null
    }).subscribe({
      next: () => {
        this.successMessage = 'Student created successfully.';
        this.load();
        this.setTab('list');
      },
      error: () => (this.errorMessage = 'Could not create student.')
    });
  }

  startEdit(student: Student): void {
    this.editingStudent = student;

    const [firstName, ...rest] = student.fullName.split(' ');

    this.editForm.setValue({
      id: student.id,
      firstName,
      lastName: rest.join(' ') || '',
      phoneNumber: student.phoneNumber ?? '',
      admissionNumber: student.admissionNumber,
      dob: student.dob.substring(0, 10),
      gender: student.gender,
      address: student.address,
      bloodGroup: student.bloodGroup ?? '',
      newPassword: ''
    });

    this.setTab('manage');
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
        this.setTab('list');
      },
      error: () => (this.errorMessage = 'Could not update student.')
    });
  }

  remove(id: string): void {
    this.studentsService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Student deleted successfully.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete student.')
    });
  }

  selectForManage(student: Student): void {
    this.selectedStudentId = student.id;
    this.setTab('manage');
  }

  enrollSelected(): void {
    if (!this.selectedStudentId || this.enrollForm.invalid) return;

    this.studentsService.enroll(this.selectedStudentId, this.enrollForm.getRawValue())
      .subscribe({
        next: () => (this.successMessage = 'Student enrolled successfully.'),
        error: () => (this.errorMessage = 'Could not enroll selected student.')
      });
  }

  linkParentToSelected(): void {
    if (!this.selectedStudentId || this.linkParentForm.invalid) return;

    this.studentsService.linkParent(this.selectedStudentId, this.linkParentForm.getRawValue())
      .subscribe({
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