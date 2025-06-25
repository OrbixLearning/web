import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LearningPathGenerationStatusEnum } from '../enums/LearningPathGenerationStatus.enum';
import { ContextService } from '../services/context.service';
import { LearningPathStudyService } from '../services/learning-path-study.service';
import { getParamFromRouteTree } from '../utils/guard.utils';

export const learningPathStudyGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const learningPathId = getParamFromRouteTree(route, 'learningPathId');
	const ctx = inject(ContextService);
	const service = inject(LearningPathStudyService);
	try {
		if (!learningPathId) {
			throw new Error('Learning path ID not found in route parameters');
		}
		if (!ctx.learningPathStudy || ctx.learningPathStudy.learningPath.id !== learningPathId) {
			ctx.learningPathStudy = await lastValueFrom(service.get(learningPathId));
			const genStatus = ctx.learningPathStudy.learningPath.generation.status;
			if (genStatus !== LearningPathGenerationStatusEnum.GENERATED) {
				throw new Error('Learning path not generated');
			}
		}
		return true;
	} catch (e) {
		ctx.clearLearningPathStudy();
		const institutionId = getParamFromRouteTree(route, 'institutionId');
		const classroomId = getParamFromRouteTree(route, 'classroomId');
		router.navigateByUrl('/i/' + institutionId + '/c/' + classroomId);
		return false;
	}
};
