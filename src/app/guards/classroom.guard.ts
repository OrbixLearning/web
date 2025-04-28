import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextService } from '../services/context.service';

export const classroomGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	let classroomId = route.params['classroomId'];
	const ctx = inject(ContextService);
	try {
		if (!classroomId) {
			throw new Error('Classroom ID not found in route parameters');
		}
		if (ctx.classroomList === undefined) {
			await ctx.classroomListLoading;
		}
		if (!ctx.classroomList || ctx.classroomList.length === 0) {
			throw new Error('Classroom list is empty');
		}
		if (!ctx.classroomList.some(i => i.id === classroomId)) {
			throw new Error('Classroom not found in list');
		}
		return true;
	} catch (e) {
		let institutionId = route.params['institutionId'];
		router.navigateByUrl('/i/' + institutionId);
		return false;
	}
};
