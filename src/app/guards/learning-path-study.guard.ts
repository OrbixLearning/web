import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ErrorPopUpComponent, ErrorPopUpData } from '../components/pop-ups/error-pop-up/error-pop-up.component';
import { LearningPathGenerationStatusEnum } from '../enums/LearningPathGenerationStatus.enum';
import { ContextService } from '../services/context.service';
import { LearningPathStudyService } from '../services/learning-path-study.service';
import { getParamFromRouteTree } from '../utils/guard.utils';

export const learningPathStudyGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const learningPathId = getParamFromRouteTree(route, 'learningPathId');
	const ctx = inject(ContextService);
	const service = inject(LearningPathStudyService);
	const dialog = inject(MatDialog);
	try {
		if (!learningPathId) {
			throw new Error('Learning path ID not found in route parameters');
		}
		if (!ctx.learningPathStudy || ctx.learningPathStudy.learningPath.id !== learningPathId) {
			try {
				ctx.learningPathStudy = await lastValueFrom(service.get(learningPathId, true));
				const genStatus = ctx.learningPathStudy!.learningPath.generation.status;
				if (genStatus !== LearningPathGenerationStatusEnum.GENERATED) {
					throw new Error('Learning path not generated');
				}
			} catch (error) {
				const errorData: ErrorPopUpData = {
					code: 401,
					message:
						'Você não tem acesso a essa rota de aprendizagem. Entre em contato com o criador da rota para compartilhá-la.',
					buttonText: 'Voltar para a turma',
				};
				await lastValueFrom(dialog.open(ErrorPopUpComponent, { data: errorData }).afterClosed());
				throw new Error('Learning path study not accessible');
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
