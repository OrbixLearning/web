import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextService } from '../services/context.service';
import { getParamFromRouteTree } from '../utils/guard.utils';
import { TutorialUtils } from '../utils/Tutorial.utils';

export const institutionGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const institutionId = getParamFromRouteTree(route, 'institutionId');
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
		let institution = ctx.institutionList.find(i => i.id === institutionId);
		if (!institution) {
			throw new Error('Institution not found in list');
		}
		if (ctx.institution?.id !== institutionId) {
			ctx.clearClassroom();
		}
		ctx.institution = institution;
		if (ctx.institutionRoles === undefined) {
			await ctx.loadInstitutionRoles();
		}
		if (
			TutorialUtils.institutionHasMissingSetup(institution) &&
			ctx.isInstitutionAdmin &&
			!state.url.endsWith('/setup')
		) {
			router.navigateByUrl('/i/' + institutionId + '/setup');
		}
		if (!TutorialUtils.institutionHasMissingSetup(institution) && state.url.endsWith('/setup')) {
			router.navigateByUrl('/i/' + institutionId);
		}
		return true;
	} catch (e) {
		ctx.clearInstitution();
		router.navigateByUrl('/');
		return false;
	}
};
