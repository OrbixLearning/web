import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { RoadmapTypeEnum } from '../../../enums/LearningPathType.enum';
import { Roadmap } from '../../../models/LearningPath';
import {
	AudioRoadmapStudy,
	FlashCardRoadmapStudy,
	QuestionRoadmapStudy,
	TextRoadmapStudy,
	VideoRoadmapStudy,
} from '../../../models/LearningPathStudy';
import { ContextService } from '../../../services/context.service';
import { RoadmapService } from '../../../services/learning-path.service';
import { AudioRoadmapComponent } from './audio-learning-path/audio-learning-path.component';
import { FlashCardRoadmapComponent } from './flash-card-learning-path/flash-card-learning-path.component';
import { QuestionRoadmapComponent } from './question-learning-path/question-learning-path.component';
import { TextRoadmapComponent } from './text-learning-path/text-learning-path.component';
import { VideoRoadmapComponent } from './video-learning-path/video-learning-path.component';

@Component({
	selector: 'o-roadmap',
	imports: [
		MatButtonModule,
		MatIconModule,
		RouterModule,
		LoadingComponent,
		TooltipModule,
		ToggleSwitchModule,
		FormsModule,
		AudioRoadmapComponent,
		FlashCardRoadmapComponent,
		QuestionRoadmapComponent,
		TextRoadmapComponent,
		VideoRoadmapComponent,
	],
	templateUrl: './learning-path.component.html',
	styleUrl: './learning-path.component.scss',
})
export class RoadmapComponent {
	ctx: ContextService = inject(ContextService);
	service: RoadmapService = inject(RoadmapService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);

	isLoading: boolean = false;
	mine: boolean = this.ctx.roadmapStudy?.roadmap.creator.id === this.ctx.user?.id;
	mode: 'view' | 'study' = this.mine || !this.ctx.isTeacher ? 'study' : 'view';
	typeEnum = RoadmapTypeEnum;

	get roadmapStudyAsAudio(): AudioRoadmapStudy {
		return this.ctx.roadmapStudy as AudioRoadmapStudy;
	}

	get roadmapStudyAsFlashCard(): FlashCardRoadmapStudy {
		return this.ctx.roadmapStudy as FlashCardRoadmapStudy;
	}

	get roadmapStudyAsQuestion(): QuestionRoadmapStudy {
		return this.ctx.roadmapStudy as QuestionRoadmapStudy;
	}

	get roadmapStudyAsText(): TextRoadmapStudy {
		return this.ctx.roadmapStudy as TextRoadmapStudy;
	}

	get roadmapStudyAsVideo(): VideoRoadmapStudy {
		return this.ctx.roadmapStudy as VideoRoadmapStudy;
	}

	toggleMode() {
		if (this.mode === 'view') {
			this.mode = 'study';
		} else {
			this.mode = 'view';
		}
	}

	async validateRoadmap() {
		this.isLoading = true;
		await lastValueFrom(this.service.validateRoadmap(this.ctx.roadmapStudy!.roadmap.id, true))
			.then((roadmap: Roadmap) => {
				this.ctx.roadmapStudy!.roadmap = roadmap;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async updatedRoadmapSharing() {
		this.isLoading = true;
		await lastValueFrom(
			this.service.updateRoadmapSharing(this.ctx.roadmapStudy!.roadmap.id, this.ctx.roadmapStudy!.roadmap.shared),
		).finally(() => {
			this.isLoading = false;
		});
	}

	async deleteRoadmap() {
		let data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja excluir esta rota de aprendizagem?',
			message: 'Esta ação não poderá ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async result => {
				if (result) {
					this.isLoading = true;
					await lastValueFrom(this.service.delete(this.ctx.roadmapStudy!.roadmap.id))
						.then(() => {
							this.router.navigateByUrl(`/i/${this.ctx.institution?.id}/c/${this.ctx.classroom?.id}`);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
