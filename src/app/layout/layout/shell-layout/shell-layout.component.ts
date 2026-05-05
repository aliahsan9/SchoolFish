import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStoreService } from '../../../core/services/auth-store.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss']
})
export class ShellLayoutComponent {

  sidebarOpen = signal(true);
  mobileSidebar = signal(false);

  userName = computed(() => this.auth.user()?.fullName ?? 'User');

  constructor(
    readonly auth: AuthStoreService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  toggleMobileSidebar() {
    this.mobileSidebar.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }

  hasAnyRole(...roles: string[]): boolean {
    const mine = (this.auth.user()?.roles ?? []).map(r => r.toLowerCase());
    return roles.some(role => mine.includes(role.toLowerCase()));
  }
}