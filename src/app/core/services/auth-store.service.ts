import { Injectable, computed, signal } from '@angular/core';
import { AuthResponse } from '../models/api.models';

const AUTH_KEY = 'sm_auth';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private readonly state = signal<AuthResponse | null>(this.readState());
  readonly user = computed(() => this.state());
  readonly isAuthenticated = computed(() => !!this.state()?.accessToken);

  setSession(session: AuthResponse): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    this.state.set(session);
  }

  clear(): void {
    localStorage.removeItem(AUTH_KEY);
    this.state.set(null);
  }

  get accessToken(): string | null {
    return this.state()?.accessToken ?? null;
  }

  get refreshToken(): string | null {
    return this.state()?.refreshToken ?? null;
  }

  private readState(): AuthResponse | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  }
}
