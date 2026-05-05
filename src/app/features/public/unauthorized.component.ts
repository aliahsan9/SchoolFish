import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container py-5 text-center">
      <h2>Access denied</h2>
      <p class="text-muted">You do not have permission to access this page with your current role.</p>
      <a class="btn btn-brand" routerLink="/app/dashboard">Back to Dashboard</a>
    </div>
  `
})
export class UnauthorizedComponent {}
