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
import { LearningPathTypeEnum } from '../../../enums/LearningPathType.enum';
import { LearningPath } from '../../../models/LearningPath/LearningPath';
import {
	AudioLearningPathStudy,
	FlashCardLearningPathStudy,
	QuestionLearningPathStudy,
	TextLearningPathStudy,
	VideoLearningPathStudy,
} from '../../../models/LearningPath/LearningPathStudy';
import { ContextService } from '../../../services/context.service';
import { LearningPathService } from '../../../services/learning-path.service';
import { AudioLearningPathComponent } from './audio-learning-path/audio-learning-path.component';
import { FlashCardLearningPathComponent } from './flash-card-learning-path/flash-card-learning-path.component';
import { QuestionLearningPathComponent } from './question-learning-path/question-learning-path.component';
import { TextLearningPathComponent } from './text-learning-path/text-learning-path.component';
import { VideoLearningPathComponent } from './video-learning-path/video-learning-path.component';
import { LearningPathGenerationStatusEnum } from '../../../enums/LearningPathGenerationStatus.enum';

@Component({
	selector: 'o-learning-path',
	imports: [
		MatButtonModule,
		MatIconModule,
		RouterModule,
		LoadingComponent,
		TooltipModule,
		ToggleSwitchModule,
		FormsModule,
		AudioLearningPathComponent,
		FlashCardLearningPathComponent,
		QuestionLearningPathComponent,
		TextLearningPathComponent,
		VideoLearningPathComponent,
	],
	templateUrl: './learning-path.component.html',
	styleUrl: './learning-path.component.scss',
})
export class LearningPathComponent {
	ctx: ContextService = inject(ContextService);
	service: LearningPathService = inject(LearningPathService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);

	isLoading: boolean = false;
	mine: boolean = this.ctx.learningPathStudy?.learningPath.creator.id === this.ctx.user?.id;
	mode: 'view' | 'study' = this.mine || !this.ctx.isTeacher ? 'study' : 'view';
	typeEnum = LearningPathTypeEnum;
	generationStatusEnum = LearningPathGenerationStatusEnum;

	get generationStatus(): LearningPathGenerationStatusEnum | undefined {
		return this.ctx.learningPathStudy?.learningPath.generation.status;
	}

	get learningPathStudyAsAudio(): AudioLearningPathStudy {
		return this.ctx.learningPathStudy as AudioLearningPathStudy;
	}

	get learningPathStudyAsFlashCard(): FlashCardLearningPathStudy {
		return this.ctx.learningPathStudy as FlashCardLearningPathStudy;
	}

	get learningPathStudyAsQuestion(): QuestionLearningPathStudy {
		return this.ctx.learningPathStudy as QuestionLearningPathStudy;
	}

	get learningPathStudyAsText(): TextLearningPathStudy {
		return this.ctx.learningPathStudy as TextLearningPathStudy;
	}

	get learningPathStudyAsVideo(): VideoLearningPathStudy {
		return this.ctx.learningPathStudy as VideoLearningPathStudy;
	}

	toggleMode() {
		if (this.mode === 'view') {
			this.mode = 'study';
		} else {
			this.mode = 'view';
		}
	}

	async validateLearningPath() {
		this.isLoading = true;
		await lastValueFrom(this.service.validateLearningPath(this.ctx.learningPathStudy!.learningPath.id, true))
			.then((learningPath: LearningPath) => {
				this.ctx.learningPathStudy!.learningPath = learningPath;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async updatedLearningPathSharing() {
		this.isLoading = true;
		await lastValueFrom(
			this.service.updateLearningPathSharing(
				this.ctx.learningPathStudy!.learningPath.id,
				this.ctx.learningPathStudy!.learningPath.shared,
			),
		).finally(() => {
			this.isLoading = false;
		});
	}

	async deleteLearningPath() {
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
					await lastValueFrom(this.service.delete(this.ctx.learningPathStudy!.learningPath.id))
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
