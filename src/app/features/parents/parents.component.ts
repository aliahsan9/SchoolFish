import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParentItem } from '../../core/models/api.models';
import { ParentsService } from '../../core/services/parents.service';

@Component({
  selector: 'app-parents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.scss']
})
export class ParentsComponent implements OnInit {

  private readonly fb = inject(FormBuilder);

  parents: ParentItem[] = [];
  editingParent: ParentItem | null = null;

  successMessage = '';
  errorMessage = '';

  activeTab = signal<'list' | 'create' | 'edit'>('list');

  readonly createForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    password: ['Parent@123', Validators.required],
    occupation: ['']
  });

  readonly editForm = this.fb.nonNullable.group({
    id: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: [''],
    occupation: ['']
  });

  constructor(private readonly parentsService: ParentsService) {}

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

    this.parentsService.create({
      ...value,
      phoneNumber: value.phoneNumber || null,
      occupation: value.occupation || null
    }).subscribe({
      next: () => {
        this.successMessage = 'Parent created successfully.';
        this.load();
        this.setTab('list');
      },
      error: () => (this.errorMessage = 'Could not create parent.')
    });
  }

  startEdit(parent: ParentItem): void {
    this.editingParent = parent;

    const [firstName, ...rest] = parent.fullName.split(' ');

    this.editForm.setValue({
      id: parent.id,
      firstName,
      lastName: rest.join(' ') || '',
      phoneNumber: parent.phoneNumber || '',
      occupation: parent.occupation || ''
    });

    this.setTab('edit');
  }

  cancelEdit(): void {
    this.editingParent = null;
    this.setTab('list');
  }

  update(): void {
    if (this.editForm.invalid) return;
    this.clearMessages();

    const value = this.editForm.getRawValue();

    this.parentsService.update({
      ...value,
      phoneNumber: value.phoneNumber || null,
      occupation: value.occupation || null
    }).subscribe({
      next: () => {
        this.successMessage = 'Parent updated successfully.';
        this.editingParent = null;
        this.load();
        this.setTab('list');
      },
      error: () => (this.errorMessage = 'Could not update parent.')
    });
  }

  remove(id: string): void {
    this.clearMessages();

    this.parentsService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Parent deleted successfully.';
        this.load();
      },
      error: () => (this.errorMessage = 'Could not delete parent.')
    });
  }

  private load(): void {
    this.parentsService.list().subscribe({
      next: (data) => (this.parents = data),
      error: () => (this.errorMessage = 'Could not load parents.')
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}