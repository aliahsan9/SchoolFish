import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParentItem } from '../../core/models/api.models';
import { ParentsService } from '../../core/services/parents.service';

@Component({
  selector: 'app-parents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>

    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body">
        <h5>Create Parent</h5>
        <form [formGroup]="createForm" (ngSubmit)="create()" class="row g-2 mt-2">
          <div class="col-md-6"><input class="form-control" placeholder="First Name" formControlName="firstName" /></div>
          <div class="col-md-6"><input class="form-control" placeholder="Last Name" formControlName="lastName" /></div>
          <div class="col-md-6"><input class="form-control" placeholder="Email" formControlName="email" /></div>
          <div class="col-md-6"><input class="form-control" placeholder="Phone Number" formControlName="phoneNumber" /></div>
          <div class="col-md-6"><input type="password" class="form-control" placeholder="Password" formControlName="password" /></div>
          <div class="col-md-6"><input class="form-control" placeholder="Occupation" formControlName="occupation" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="createForm.invalid">Create Parent</button></div>
        </form>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5>Parents</h5>
        <table class="table mt-3">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Occupation</th><th class="text-end">Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of parents">
              <td>{{ p.fullName }}</td>
              <td>{{ p.email }}</td>
              <td>{{ p.phoneNumber }}</td>
              <td>{{ p.occupation || '-' }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2" (click)="startEdit(p)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" (click)="remove(p.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card border-0 shadow-sm mt-3" *ngIf="editingParent">
      <div class="card-body">
        <h5>Edit Parent</h5>
        <form [formGroup]="editForm" (ngSubmit)="update()" class="row g-2">
          <div class="col-md-3"><input class="form-control" placeholder="First Name" formControlName="firstName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Last Name" formControlName="lastName" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Phone" formControlName="phoneNumber" /></div>
          <div class="col-md-3"><input class="form-control" placeholder="Occupation" formControlName="occupation" /></div>
          <div class="col-md-3"><button class="btn btn-brand w-100" [disabled]="editForm.invalid">Save</button></div>
          <div class="col-md-3"><button type="button" class="btn btn-outline-secondary w-100" (click)="cancelEdit()">Cancel</button></div>
        </form>
      </div>
    </div>
  `
})
export class ParentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  parents: ParentItem[] = [];
  editingParent: ParentItem | null = null;
  successMessage = '';
  errorMessage = '';

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

  create(): void {
    if (this.createForm.invalid) return;
    this.clearMessages();
    const value = this.createForm.getRawValue();
    this.parentsService
      .create({
        ...value,
        phoneNumber: value.phoneNumber || null,
        occupation: value.occupation || null
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Parent created successfully.';
          this.load();
        },
        error: () => (this.errorMessage = 'Could not create parent.')
      });
  }

  startEdit(parent: ParentItem): void {
    this.editingParent = parent;
    const [firstName, ...rest] = parent.fullName.split(' ');
    this.editForm.setValue({
      id: parent.id,
      firstName: firstName ?? '',
      lastName: rest.join(' ') || '',
      phoneNumber: parent.phoneNumber || '',
      occupation: parent.occupation || ''
    });
  }

  cancelEdit(): void {
    this.editingParent = null;
  }

  update(): void {
    if (this.editForm.invalid) return;
    this.clearMessages();
    const value = this.editForm.getRawValue();
    this.parentsService
      .update({
        ...value,
        phoneNumber: value.phoneNumber || null,
        occupation: value.occupation || null
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Parent updated successfully.';
          this.editingParent = null;
          this.load();
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
