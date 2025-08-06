import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { lastValueFrom } from 'rxjs';
import { AIChatMessage } from '../../models/AIChatMessage';
import { AIChatService } from '../../services/aichat.service';
import { ContextService } from '../../services/context.service';
import { LoadingComponent } from '../loading/loading.component';
import { LearningPath } from '../../models/LearningPath/LearningPath';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopUpComponent, ConfirmPopUpData } from '../pop-ups/confirm-pop-up/confirm-pop-up.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'o-chat',
	imports: [
		LoadingComponent,
		MatButtonModule,
		MatInputModule,
		FormsModule,
		MatFormFieldModule,
		MatIconModule,
		MarkdownModule,
		TooltipModule,
	],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.scss',
})
export class ChatComponent {
	ctx: ContextService = inject(ContextService);
	service: AIChatService = inject(AIChatService);
	route: ActivatedRoute = inject(ActivatedRoute);
	dialog: MatDialog = inject(MatDialog);

	@Input() learningPaths: LearningPath[] = [];
	@Input() showLearningPaths: boolean = true;
	@Output() removeLearningPath: EventEmitter<LearningPath> = new EventEmitter<LearningPath>();

	messages: AIChatMessage[] = [];
	input: string = '';
	isLoading: boolean = false;
	error: boolean = false;
	page: number = 0;

	ngOnInit() {
		// This is used to update the data when the classroomId changes in the URL
		this.route.params.subscribe(params => {
			this.reset();
			this.getData();
		});
	}

	get isInputEmpty(): boolean {
		return !this.input || this.input.trim() === '';
	}

	get isSending(): boolean {
		return this.messages.length > 0 && this.messages[0].userMessage;
	}

	reset() {
		this.messages = [];
		this.input = '';
		this.page = 0;
		this.error = false;
		this.isLoading = false;
	}

	async getData() {
		this.isLoading = true;
		const LIMIT = 30;
		await lastValueFrom(this.service.getChatHistory(this.ctx.classroom!.id, this.page, LIMIT))
			.then(data => {
				this.messages.push(...data);
				if (data.length === LIMIT) {
					this.page++;
				}
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async sendMessage() {
		const aiChatMessage: AIChatMessage = {
			content: this.input,
			userMessage: true,
		};
		this.messages.unshift(aiChatMessage);
		const learningPathIds = this.learningPaths.map(lp => lp.id!) || [];
		await lastValueFrom(this.service.chat(this.ctx.classroom!.id, this.input, learningPathIds))
			.then(data => {
				this.messages.unshift(data);
				this.input = '';
				this.error = false;
			})
			.catch(() => {
				this.error = true;
			});
	}

	clear() {
		const data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja limpar o chat?',
			message: 'Essa ação não pode ser desfeita.',
			confirmButton: 'Limpar',
		};
		this.dialog
			.open(ConfirmPopUpComponent, {
				data,
			})
			.afterClosed()
			.subscribe(async confirmed => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.service.clear(this.ctx.classroom!.id))
						.then(() => {
							this.reset();
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
