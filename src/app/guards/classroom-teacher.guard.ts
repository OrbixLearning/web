import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextService } from '../services/context.service';
import { getParamFromRouteTree } from '../utils/guard.utils';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';

export const classroomTeacherGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const ctx = inject(ContextService);
	try {
		if (ctx.institutionRoles === undefined) {
			await ctx.loadInstitutionRoles();
		}

		return (
			ctx.institutionRoles!.includes(InstitutionRoleEnum.ADMIN) ||
			ctx.institutionRoles!.includes(InstitutionRoleEnum.CREATOR) ||
			ctx.institutionRoles!.includes(InstitutionRoleEnum.TEACHER)
		);
	} catch (e) {
		const institutionId = getParamFromRouteTree(route, 'institutionId');
		const classroomId = getParamFromRouteTree(route, 'classroomId');
		router.navigateByUrl('/i/' + institutionId + '/c/' + classroomId);
		return false;
	}
};
