import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { ContextService } from '../services/context.service';
import { getParamFromRouteTree } from '../utils/guard.utils';

export const institutionAdminGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const ctx = inject(ContextService);
	try {
		if (ctx.institutionRoles === undefined) {
			await ctx.loadInstitutionRoles();
		}

		return (
			ctx.institutionRoles!.includes(InstitutionRoleEnum.ADMIN) ||
			ctx.institutionRoles!.includes(InstitutionRoleEnum.CREATOR)
		);
	} catch (e) {
		const institutionId = getParamFromRouteTree(route, 'institutionId');
		router.navigateByUrl('/i/' + institutionId);
		return false;
	}
};
