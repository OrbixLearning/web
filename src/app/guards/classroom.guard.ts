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
			await ctx.loadClassroomList();
		}
		if (!ctx.classroomList || ctx.classroomList.length === 0) {
			throw new Error('Classroom list is empty');
		}
		let classroom = ctx.classroomList.find(i => i.id === classroomId);
		if (!classroom) {
			throw new Error('Classroom not found in list');
		}
		if (ctx.classroom?.id !== classroomId) {
			ctx.clearRoadmapStudy();
		}
		ctx.classroom = classroom;
		return true;
	} catch (e) {
		ctx.clearClassroom();
		let institutionId = route.params['institutionId'];
		router.navigateByUrl('/i/' + institutionId);
		return false;
	}
};
