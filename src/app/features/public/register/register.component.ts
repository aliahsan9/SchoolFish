import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    password: ['', Validators.required],
    roleName: ['Admin', Validators.required]
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;

    this.errorMessage = '';
    this.loading = true;

    const value = this.form.getRawValue();

    this.authService.register({
      ...value,
      phoneNumber: value.phoneNumber || null
    }).subscribe({
      next: () => void this.router.navigateByUrl('/app/dashboard'),
      error: () => {
        this.loading = false;
        this.errorMessage = 'Registration failed. Please verify required fields and try again.';
      }
    });
  }
}