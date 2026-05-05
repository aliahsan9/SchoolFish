import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest
} from '../models/api.models';
import { ApiClientService } from './api-client.service';
import { AuthStoreService } from './auth-store.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly api: ApiClientService,
    private readonly authStore: AuthStoreService
  ) {}

  login(payload: LoginRequest) {
    return this.api.post<AuthResponse>('Auth/login', payload).pipe(tap((s) => this.authStore.setSession(s)));
  }

  register(payload: RegisterRequest) {
    return this.api.post<AuthResponse>('Auth/register', payload).pipe(tap((s) => this.authStore.setSession(s)));
  }

  refresh() {
    const refreshToken = this.authStore.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const payload: RefreshTokenRequest = { refreshToken };
    return this.api.post<AuthResponse>('Auth/refresh', payload).pipe(tap((s) => this.authStore.setSession(s)));
  }

  logout(): void {
    this.authStore.clear();
  }
}
