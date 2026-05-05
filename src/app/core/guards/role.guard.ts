import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthStoreService } from '../services/auth-store.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);
  const requiredRoles = (route.data['roles'] as string[] | undefined)?.map((x) => x.toLowerCase()) ?? [];
  if (!requiredRoles.length) return true;

  const userRoles = (authStore.user()?.roles ?? []).map((x) => x.toLowerCase());
  const allowed = requiredRoles.some((role) => userRoles.includes(role));
  return allowed ? true : router.createUrlTree(['/app/unauthorized']);
};
