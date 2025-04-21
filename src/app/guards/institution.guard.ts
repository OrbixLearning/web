import { CanActivateFn } from '@angular/router';

export const institutionGuard: CanActivateFn = (route, state) => {
  return true;
};
