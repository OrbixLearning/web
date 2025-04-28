import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ContextService } from '../services/context.service';

export const authGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const authService = inject(AuthService);
	const ctx = inject(ContextService);
	try {
		if (!ctx.user) {
			ctx.user = await lastValueFrom(authService.auth());
		}
		return true;
	} catch (e) {
		router.navigateByUrl('/login');
		return false;
	}
};
