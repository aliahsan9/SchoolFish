import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Teacher } from '../../core/models/api.models';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { TeachersService } from '../../core/services/teachers.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);

  teachers: Teacher[] = [];
  editingTeacher: Teacher | null = null;

  successMessage = '';
  errorMessage = '';

  activeTab = signal<'list' | 'create' | 'edit'>('list');

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
    return (this.authStore.user()?.roles ?? []).some(r => r.toLowerCase() === 'admin');
  }

  ngOnInit(): void {
    this.load();
  }

  setTab(tab: 'list' | 'create' | 'edit') {
    this.activeTab.set(tab);
  }

  /* ===== ORIGINAL LOGIC (UNCHANGED) ===== */

  create(): void {
    if (this.createForm.invalid) return;
    this.clearMessages();

    const value = this.createForm.getRawValue();

    this.teachersService.create({
      ...value,
      phoneNumber: value.phoneNumber || null
    }).subscribe({
      next: () => {
        this.successMessage = 'Teacher created successfully.';
        this.load();
        this.setTab('list');
      },
      error: () => (this.errorMessage = 'Could not create teacher.')
    });
  }

  startEdit(teacher: Teacher): void {
    this.editingTeacher = teacher;

    const [firstName, ...rest] = teacher.fullName.split(' ');

    this.editForm.setValue({
      id: teacher.id,
      firstName,
      lastName: rest.join(' ') || '',
      phoneNumber: '',
      employeeId: teacher.employeeId,
      joiningDate: teacher.joiningDate?.substring(0, 10) ?? '',
      qualification: teacher.qualification,
      experienceYears: teacher.experienceYears,
      newPassword: ''
    });

    this.setTab('edit');
  }

  update(): void {
    if (this.editForm.invalid) return;
    this.clearMessages();

    const value = this.editForm.getRawValue();

    this.teachersService.update({
      ...value,
      phoneNumber: value.phoneNumber || null,
      newPassword: value.newPassword || null
    }).subscribe({
      next: () => {
        this.successMessage = 'Teacher updated successfully.';
        this.editingTeacher = null;
        this.load();
        this.setTab('list');
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