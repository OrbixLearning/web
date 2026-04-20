import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextService } from '../services/context.service';
import { getParamFromRouteTree } from '../utils/guard.utils';
import { TutorialUtils } from '../utils/Tutorial.utils';

export const classroomGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const classroomId = getParamFromRouteTree(route, 'classroomId');
	const institutionId = getParamFromRouteTree(route, 'institutionId');
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
			ctx.clearLearningPathStudy();
		}
		ctx.classroom = classroom;
		if (TutorialUtils.hasMissingSetup(classroom) && ctx.isTeacher && !state.url.endsWith('/setup')) {
			router.navigateByUrl('/i/' + institutionId + '/c/' + classroomId + '/setup');
		}
		return true;
	} catch (e) {
		ctx.clearClassroom();
		router.navigateByUrl('/i/' + institutionId);
		return false;
	}
};
