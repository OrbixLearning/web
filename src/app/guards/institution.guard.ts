import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextService } from '../services/context.service';
import { getParamFromRouteTree } from '../utils/guard.utils';
import { ThemeService } from '../services/theme.service';

export const institutionGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const institutionId = getParamFromRouteTree(route, 'institutionId');
	const ctx = inject(ContextService);
	const themeService = inject(ThemeService);
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
		let institution = ctx.institutionList.find(i => i.id === institutionId);
		if (!institution) {
			throw new Error('Institution not found in list');
		}
		if (ctx.institution?.id !== institutionId) {
			ctx.clearClassroom();
		}
		ctx.institution = institution;
		themeService.setInstitutionTheme(institution);
		return true;
	} catch (e) {
		ctx.clearInstitution();
		themeService.applySavedGlobalTheme();
		router.navigateByUrl('/');
		return false;
	}
};
