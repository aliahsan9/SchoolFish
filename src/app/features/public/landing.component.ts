import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container py-5">
      <div class="hero p-5 rounded-4 shadow-sm">
        <h1 class="display-5 fw-bold">Build your campus with one powerful system.</h1>
        <p class="lead mt-3">
          Manage students, classes, fees, exams and subscriptions in one professional school platform.
        </p>
        <div class="d-flex gap-3 mt-4">
          <a class="btn btn-light btn-lg" routerLink="/login">Login</a>
          <a class="btn btn-outline-light btn-lg" routerLink="/register">Sign Up</a>
        </div>
      </div>
    </div>
  `,
  styles: `.hero{background:linear-gradient(135deg,#08d7df,#26b5be);color:#043438;}`
})
export class LandingComponent {}
