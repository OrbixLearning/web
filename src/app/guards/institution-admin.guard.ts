import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { ContextService } from '../services/context.service';
import { getParamFromRouteTree } from '../utils/guard.utils';

export const institutionAdminGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const institutionId = getParamFromRouteTree(route, 'institutionId');
	const ctx = inject(ContextService);
	try {
		if (!institutionId) {
			throw new Error('Institution ID not found in route parameters');
		}

		const user = ctx.user;
		if (!user) {
			throw new Error('User not found in context');
		}

		const createdInstitutionsIds = user.createdInstitutions?.map(i => i.id);
		if (createdInstitutionsIds && createdInstitutionsIds.includes(institutionId)) {
			return true;
		}

		for (const account of user.accounts) {
			if (account.institution?.id === institutionId && account.institutionRole === InstitutionRoleEnum.ADMIN) {
				return true;
			}
		}

		throw new Error('User is not an admin of the institution');
	} catch (e) {
		router.navigateByUrl('/i/' + institutionId);
		return false;
	}
};
