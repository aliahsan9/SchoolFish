import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container text-center py-5">
      <h1 class="display-3 fw-bold text-brand-dark">404</h1>
      <p class="lead">Sorry, the page you are looking for is not found.</p>
      <a class="btn btn-brand" routerLink="/">Go to Home</a>
    </div>
  `
})
export class NotFoundComponent {}
