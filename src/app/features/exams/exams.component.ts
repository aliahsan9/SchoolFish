import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcademicCatalog, Exam } from '../../core/models/api.models';
import { AcademicService } from '../../core/services/academic.service';
import { AuthStoreService } from '../../core/services/auth-store.service';
import { ExamsService } from '../../core/services/exams.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStoreService);

  exams: Exam[] = [];
  editingExam: Exam | null = null;
  catalog: AcademicCatalog | null = null;

  successMessage = '';
  errorMessage = '';

  activeTab = signal<'list' | 'create' | 'edit'>('list');

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
    return (this.authStore.user()?.roles ?? []).some(r => r.toLowerCase() === 'admin');
  }

  setTab(tab: 'list' | 'create' | 'edit') {
    this.activeTab.set(tab);
  }

  ngOnInit(): void {
    this.load();
    this.academicService.getCatalog().subscribe({
      next: (data) => (this.catalog = data)
    });
  }

  /* ===== ORIGINAL LOGIC (UNCHANGED) ===== */

  create(): void {
    if (this.createForm.invalid) return;
    this.clearMessages();

    this.examsService.create(this.createForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Exam created successfully.';
        this.load();
        this.setTab('list');
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

    this.setTab('edit');
  }

  cancelEdit(): void {
    this.editingExam = null;
    this.setTab('list');
  }

  update(): void {
    if (this.editForm.invalid) return;
    this.clearMessages();

    this.examsService.update(this.editForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = 'Exam updated successfully.';
        this.editingExam = null;
        this.load();
        this.setTab('list');
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

  /* ===== UI HELPERS (NO LOGIC CHANGE) ===== */

  getStatus(exam: Exam): 'Upcoming' | 'Ongoing' | 'Completed' {
    const now = new Date().getTime();
    const start = new Date(exam.startDate).getTime();
    const end = new Date(exam.endDate).getTime();

    if (now < start) return 'Upcoming';
    if (now > end) return 'Completed';
    return 'Ongoing';
  }
}