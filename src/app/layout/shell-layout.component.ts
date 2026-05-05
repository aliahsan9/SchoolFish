import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStoreService } from '../core/services/auth-store.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">School ERP</div>
        <a routerLink="/app/dashboard" routerLinkActive="active">Dashboard</a>
        <a *ngIf="hasAnyRole('Admin','Teacher')" routerLink="/app/students" routerLinkActive="active">Students</a>
        <a *ngIf="hasAnyRole('Admin','Teacher')" routerLink="/app/teachers" routerLinkActive="active">Teachers</a>
        <a *ngIf="hasAnyRole('Admin')" routerLink="/app/parents" routerLinkActive="active">Parents</a>
        <a *ngIf="hasAnyRole('Admin','Teacher')" routerLink="/app/fees" routerLinkActive="active">Fees</a>
        <a *ngIf="hasAnyRole('Admin','Teacher')" routerLink="/app/academic" routerLinkActive="active">Academic</a>
        <a *ngIf="hasAnyRole('Admin','Teacher')" routerLink="/app/exams" routerLinkActive="active">Exams</a>
        <a *ngIf="hasAnyRole('Admin')" routerLink="/app/billing" routerLinkActive="active">Billing</a>
        <a routerLink="/app/profile" routerLinkActive="active">My Profile</a>
      </aside>
      <main class="content">
        <header class="topbar">
          <div>Welcome, {{ auth.user()?.fullName ?? 'User' }}</div>
          <button class="btn btn-sm btn-outline-light" (click)="logout()">Logout</button>
        </header>
        <section class="content-body">
          <router-outlet />
        </section>
      </main>
    </div>
  `,
  styles: `
    .app-shell { min-height: 100vh; display: flex; background: #d8fbff; }
    .sidebar { width: 250px; background: #08d7df; padding: 1rem; display: flex; flex-direction: column; gap: .4rem; }
    .brand { font-weight: 700; font-size: 1.3rem; margin-bottom: .6rem; color: #00363a; }
    .sidebar a { text-decoration: none; color: #02484d; font-weight: 600; padding: .55rem .7rem; border-radius: .45rem; }
    .sidebar a.active, .sidebar a:hover { background: #fff; color: #034046; }
    .content { flex: 1; display: flex; flex-direction: column; }
    .topbar { background: #08d7df; color: #00363a; padding: .8rem 1.2rem; display: flex; justify-content: space-between; align-items: center; }
    .content-body { padding: 1.2rem; }
    @media (max-width: 992px) { .sidebar { width: 82px; } .sidebar a { font-size: 0; } .brand { font-size: .9rem; } }
  `
})
export class ShellLayoutComponent {
  constructor(
    readonly auth: AuthStoreService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }

  hasAnyRole(...roles: string[]): boolean {
    const mine = (this.auth.user()?.roles ?? []).map((r) => r.toLowerCase());
    return roles.some((role) => mine.includes(role.toLowerCase()));
  }
}
