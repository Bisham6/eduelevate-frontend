import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthStore } from '../admin/admin-auth.store';

export const adminGuestGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthStore);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/admin']);
};
