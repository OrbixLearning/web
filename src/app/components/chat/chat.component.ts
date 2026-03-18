import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { RemarkModule } from 'ngx-remark';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { AIChatMessage } from '../../models/AIChatMessage';
import { LearningPath } from '../../models/LearningPath/LearningPath';
import { AIChatService } from '../../services/aichat.service';
import { ContextService } from '../../services/context.service';
import { HighlightButtonComponent } from '../buttons/highlight-button/highlight-button.component';
import { LoadingComponent } from '../loading/loading.component';
import { ConfirmPopUpComponent, ConfirmPopUpData } from '../pop-ups/confirm-pop-up/confirm-pop-up.component';
import { MarkdownComponent } from "../markdown/markdown.component";

@Component({
	selector: 'o-chat',
	imports: [
    LoadingComponent,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    TooltipModule,
    MatMenuModule,
    HighlightButtonComponent,
    RemarkModule,
    MarkdownComponent
],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.scss',
})
export class ChatComponent {
	ctx: ContextService = inject(ContextService);
	service: AIChatService = inject(AIChatService);
	route: ActivatedRoute = inject(ActivatedRoute);
	dialog: MatDialog = inject(MatDialog);

	@ViewChild('messagesWrapper') messagesWrapper!: ElementRef<HTMLDivElement>;
	@Input() learningPaths: LearningPath[] = [];
	@Input() showLearningPaths: boolean = true;
	@Input() height: string = '65vh';
	@Input() message!: string;
	@Output() removeLearningPath: EventEmitter<LearningPath> = new EventEmitter<LearningPath>();
	@Output() expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	messages: AIChatMessage[] = [];
	input: string = '';
	isLoading: boolean = false;
	error: boolean = false;
	page: number = 0;
	scrollDone: boolean = false;
	file?: File;
	preview: string | ArrayBuffer | null = null;
	expanded: boolean = true;

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

	scrollToBottom() {
		this.messagesWrapper.nativeElement.scrollTo({
			top: this.messagesWrapper.nativeElement.scrollHeight,
			behavior: 'instant',
		});
	}

	toggleExpanded() {
		this.expanded = !this.expanded;
		this.expandedChange.emit(this.expanded);
	}

	getMessageImage(message: AIChatMessage) {
		return this.service.getMessageImage(message);
	}

	attachFile() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';

		input.onchange = (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (target.files && target.files.length > 0) {
				this.file = target.files[0];
			}
			if (this.file) {
				const reader = new FileReader();
				reader.onload = () => {
					this.preview = reader.result;
				};
				reader.readAsDataURL(this.file);
			}
		};

		input.click();
	}

	removeFile() {
		this.file = undefined;
		this.preview = null;
	}

	async sendMessage() {
		if (this.isSending) return;
		const aiChatMessage: AIChatMessage = {
			content: this.input,
			userMessage: true,
			containsFile: !!this.file,
		};
		this.messages.unshift(aiChatMessage);
		const learningPathIds = this.learningPaths.map(lp => lp.id!) || [];
		this.scrollToBottom();
		await lastValueFrom(this.service.chat(this.ctx.classroom!.id, this.input, learningPathIds, this.file))
			.then(data => {
				this.messages[0].id = data.userMessageId;
				this.messages.unshift(data.aiMessage);
				this.input = '';
				this.file = undefined;
				this.preview = null;
				this.error = false;
			})
			.catch(() => {
				this.error = true;
			});
	}

	onEnter(event: Event) {
		const keyboardEvent = event as KeyboardEvent;
		if (keyboardEvent.shiftKey) return;
		keyboardEvent.preventDefault();
		if (!this.isInputEmpty && !this.isSending) {
			this.sendMessage();
		}
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

	sendInstantMessage(message: string) {
		this.input = message;
		this.sendMessage();
	}
}
