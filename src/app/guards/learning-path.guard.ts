import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ContextService } from '../services/context.service';
import { LearningPathStudyService } from '../services/learning-path-study.service';

export const learningPathGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	let learningPathId = route.params['learningPathId'];
	const ctx = inject(ContextService);
	const service = inject(LearningPathStudyService);
	try {
		if (!learningPathId) {
			throw new Error('Learning path ID not found in route parameters');
		}
		if (!ctx.learningPathStudy || ctx.learningPathStudy.learningPath.id !== learningPathId) {
			ctx.learningPathStudy = await lastValueFrom(service.get(learningPathId));
		}
		return true;
	} catch (e) {
		ctx.clearLearningPathStudy();
		let institutionId = route.params['institutionId'];
		let classroomId = route.params['classroomId'];
		router.navigateByUrl('/i/' + institutionId + '/c/' + classroomId);
		return false;
	}
};
