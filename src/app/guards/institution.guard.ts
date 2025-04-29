import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextService } from '../services/context.service';

export const institutionGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	let institutionId = route.params['institutionId'];
	const ctx = inject(ContextService);
	try {
		if (!institutionId) {
			throw new Error('Institution ID not found in route parameters');
		}
		if (ctx.institutionList === undefined) {
			await ctx.loadInstitutionList();
		}
		if (!ctx.institutionList || ctx.institutionList.length === 0) {
			throw new Error('Institution list is empty');
		}
		if (!ctx.institutionList.some(i => i.id === institutionId)) {
			throw new Error('Institution not found in list');
		}
		return true;
	} catch (e) {
		router.navigateByUrl('/');
		return false;
	}
};
