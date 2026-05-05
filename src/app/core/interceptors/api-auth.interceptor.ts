import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthStoreService } from '../services/auth-store.service';

export const apiAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStoreService);
  const token = authStore.accessToken;
  const cloned = req.clone({
    setHeaders: {
      'X-Tenant-Subdomain': environment.tenantSubdomain,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  return next(cloned);
};
