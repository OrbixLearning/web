import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ContextService } from '../services/context.service';
import { RoadmapService } from '../services/roadmap.service';
import { lastValueFrom } from 'rxjs';

export const roadmapGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	let roadmapId = route.params['roadmapId'];
	const ctx = inject(ContextService);
	const service = inject(RoadmapService);
	try {
		if (!roadmapId) {
			throw new Error('Roadmap ID not found in route parameters');
		}
		if (!ctx.roadmap) {
			ctx.roadmap = await lastValueFrom(service.get(roadmapId));
		}
		return true;
	} catch (e) {
		ctx.clearRoadmap();
		let institutionId = route.params['institutionId'];
		let classroomId = route.params['classroomId'];
		router.navigateByUrl('/i/' + institutionId + '/c/' + classroomId);
		return false;
	}
};
