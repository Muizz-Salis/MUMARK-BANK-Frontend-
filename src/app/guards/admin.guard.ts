import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // During SSR/prerender there is no window/localStorage; allow activation silently
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return true;
  }

  try {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      let role: string | null = null;
      try {
        const parsed = JSON.parse(raw);
        role = typeof parsed === 'object' && parsed ? (parsed as any).role ?? null : null;
      } catch {
        // stored value might be a primitive (e.g., userId), not an object
      }
      if (role && role.toLowerCase() === 'admin') {
        return true;
      }
    }
  } catch {
    // ignore and fall through
  }

  router.navigate(['/mainpage']);
  return false;
};
