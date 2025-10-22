import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PopoverModule } from 'primeng/popover';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { AvatarComponent } from '../../../components/avatar/avatar.component';
import { HighlightButtonComponent } from '../../../components/buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../../../components/buttons/text-button/text-button.component';
import { ChatComponent } from '../../../components/chat/chat.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { SyllabusTagsComponent } from '../../../components/syllabus-tags/syllabus-tags.component';
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
import { UserService } from '../../../services/user.service';
import { AudioLearningPathComponent } from './audio-learning-path/audio-learning-path.component';
import { FlashCardLearningPathComponent } from './flash-card-learning-path/flash-card-learning-path.component';
import { QuestionLearningPathComponent } from './question-learning-path/question-learning-path.component';
import { TextLearningPathComponent } from './text-learning-path/text-learning-path.component';
import { VideoLearningPathComponent } from './video-learning-path/video-learning-path.component';
import { LearningPathStudyService } from '../../../services/learning-path-study.service';

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
		TextButtonComponent,
		HighlightButtonComponent,
		ToastModule,
		PopoverModule,
		SyllabusTagsComponent,
		AvatarComponent,
	],
	templateUrl: './learning-path.component.html',
	styleUrl: './learning-path.component.scss',
	providers: [MessageService],
})
export class LearningPathComponent {
	ctx: ContextService = inject(ContextService);
	service: LearningPathService = inject(LearningPathService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);
	toast: MessageService = inject(MessageService);
	userService: UserService = inject(UserService);
	learningPathStudyService: LearningPathStudyService = inject(LearningPathStudyService);

	@ViewChild('text') textComponent?: TextLearningPathComponent;
	@ViewChild('video') videoComponent?: VideoLearningPathComponent;
	@ViewChild('audio') audioComponent?: AudioLearningPathComponent;
	@ViewChild('flashcard') flashCardComponent?: FlashCardLearningPathComponent;
	@ViewChild('question') questionComponent?: QuestionLearningPathComponent;

	isLoading: boolean = false;
	mine: boolean = this.ctx.learningPathStudy?.learningPath.creator.id === this.ctx.user?.id;
	typeEnum = LearningPathTypeEnum;
	generationStatusEnum = LearningPathGenerationStatusEnum;
	validationRequested: boolean = false;

	mode: 'edit' | 'study' = 'study';

	get generationStatus(): LearningPathGenerationStatusEnum | undefined {
		return this.ctx.learningPathStudy?.learningPath.generation.status;
	}

	get creatorProfilePictureUrl(): string {
		if (!this.ctx.learningPathStudy?.learningPath.creator) return '';
		return this.userService.getProfilePictureUrl(this.ctx.learningPathStudy?.learningPath.creator!);
	}

	async goBackOrCancel() {
		if (this.mode === 'edit') {
			this.isLoading = true;
			await lastValueFrom(this.learningPathStudyService.get(this.ctx.learningPathStudy!.learningPath.id))
				.then(learningPathStudy => {
					this.ctx.learningPathStudy = learningPathStudy;
					this.resetLearningPath();
					this.mode = 'study';
				})
				.finally(() => {
					this.isLoading = false;
				});
		} else {
			this.router.navigateByUrl(`/i/${this.ctx.institution?.id}/c/${this.ctx.classroom?.id}`);
		}
	}

	async toggleMode() {
		if (this.mode === 'edit') {
			await this.saveLearningPath();
			this.mode = 'study';
		} else {
			if (
				this.ctx.learningPathStudy?.learningPath.type === LearningPathTypeEnum.FLASHCARD ||
				this.ctx.learningPathStudy?.learningPath.type === LearningPathTypeEnum.QUESTION
			) {
				let data: ConfirmPopUpData = {
					title: 'Entrar no modo de edição vai expor todas as respostas. Tem certeza que deseja continuar?',
					message: 'Você poderá voltar ao modo de estudo posteriormente.',
					confirmButton: 'Continuar',
				};
				this.dialog
					.open(ConfirmPopUpComponent, { data })
					.afterClosed()
					.subscribe((confirmed: boolean) => {
						if (confirmed) {
							this.mode = 'edit';
						}
					});
			} else {
				this.mode = 'edit';
			}
		}
	}

	async saveLearningPath() {
		this.isLoading = true;
		if (this.textComponent) {
			await this.textComponent.save();
		} else if (this.videoComponent) {
			await this.videoComponent.save();
		} else if (this.audioComponent) {
			await this.audioComponent.save();
		} else if (this.flashCardComponent) {
			await this.flashCardComponent.save();
		} else if (this.questionComponent) {
			await this.questionComponent.save();
		}
		this.isLoading = false;
	}

	resetLearningPath() {
		if (this.textComponent) {
			this.textComponent.reset();
		} else if (this.videoComponent) {
			this.videoComponent.reset();
		} else if (this.audioComponent) {
			this.audioComponent.reset();
		} else if (this.flashCardComponent) {
			this.flashCardComponent.reset();
		} else if (this.questionComponent) {
			this.questionComponent.reset();
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

	async requestLearningPathValidation() {
		this.isLoading = true;
		await lastValueFrom(this.service.requestValidation(this.ctx.learningPathStudy!.learningPath.id))
			.then(() => {
				this.validationRequested = true;
				this.toast.add({
					severity: 'success',
					summary: 'Solicitação enviada',
					detail: 'A solicitação de validação da rota de aprendizagem foi enviada a um professor.',
				});
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async shareLearningPath() {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja compartilhar a rota de aprendizagem "${this.ctx.learningPathStudy?.learningPath.name}"?`,
			message: `Essa ação não pode ser desfeita. Uma vez compartilhada, qualquer membro da turma poderá acessar essa rota de aprendizagem.`,
			confirmButton: 'Compartilhar',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.service.shareLearningPath(this.ctx.learningPathStudy!.learningPath.id))
						.then((learningPath: LearningPath) => {
							this.ctx.learningPathStudy!.learningPath = learningPath;
						})
						.finally(() => {
							this.isLoading = false;
						});
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

	copyLearningPathLink() {
		const completeURL = window.location.href;
		navigator.clipboard.writeText(completeURL);
		this.toast.add({
			severity: 'success',
			summary: 'Link copiado',
			detail: 'O link da rota de aprendizagem foi copiado para a área de transferência.',
		});
	}
}
