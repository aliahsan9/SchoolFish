import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
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

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  readonly roles = ['Admin', 'Teacher', 'Student'];

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleName: ['Admin', Validators.required]
  });

  passwordStrength = computed(() => {
    const value = this.form.controls.password.value;
    if (!value) return 0;
    if (value.length < 6) return 1;
    if (value.match(/[A-Z]/) && value.match(/[0-9]/)) return 3;
    return 2;
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  setRole(role: string) {
    this.form.controls.roleName.setValue(role);
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();

    this.authService.register({
      ...value,
      phoneNumber: value.phoneNumber || null
    }).subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard'),
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Registration failed. Please check inputs.');
      }
    });
  }
}