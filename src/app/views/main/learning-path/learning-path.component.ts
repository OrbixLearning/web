import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { ChatComponent } from '../../../components/chat/chat.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { LearningPathGenerationStatusEnum } from '../../../enums/LearningPathGenerationStatus.enum';
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
		ChatComponent,
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
			if (
				this.ctx.learningPathStudy?.learningPath.type === LearningPathTypeEnum.FLASHCARD ||
				this.ctx.learningPathStudy?.learningPath.type === LearningPathTypeEnum.QUESTION
			) {
				let data: ConfirmPopUpData = {
					title: 'Entrar no modo de visualização vai expor todas as respostas. Tem certeza que deseja continuar?',
					message: 'Você poderá voltar ao modo de estudo posteriormente.',
					confirmButton: 'Continuar',
				};
				this.dialog
					.open(ConfirmPopUpComponent, { data })
					.afterClosed()
					.subscribe((confirmed: boolean) => {
						if (confirmed) {
							this.mode = 'view';
						}
					});
			} else {
				this.mode = 'view';
			}
		}
	}

	async validateLearningPath(valid: boolean) {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja ${valid ? 'validar' : 'invalidar'} a rota de aprendizagem "${
				this.ctx.learningPathStudy?.learningPath.name
			}"?`,
			message: `Você poderá ${valid ? 'invalidar' : 'validar'} a rota de aprendizagem posteriormente.`,
			confirmButton: valid ? 'Validar' : 'Invalidar',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(
						this.service.validateLearningPath(this.ctx.learningPathStudy!.learningPath.id, valid),
					)
						.then((learningPath: LearningPath) => {
							this.ctx.learningPathStudy!.learningPath = learningPath;
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	async updatedLearningPathSharing() {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja ${
				this.ctx.learningPathStudy?.learningPath.shared ? 'compartilhar a' : 'remover o compartilhamento da'
			} rota de aprendizagem "${this.ctx.learningPathStudy?.learningPath.name}"?`,
			message: `Você poderá alterar essa configuração posteriormente.`,
			confirmButton: this.ctx.learningPathStudy?.learningPath.shared
				? 'Compartilhar'
				: 'Remover compartilhamento',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(
						this.service.updateLearningPathSharing(
							this.ctx.learningPathStudy!.learningPath.id,
							this.ctx.learningPathStudy!.learningPath.shared,
						),
					).finally(() => {
						this.isLoading = false;
					});
				} else {
					this.ctx.learningPathStudy!.learningPath.shared = !this.ctx.learningPathStudy!.learningPath.shared;
				}
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
