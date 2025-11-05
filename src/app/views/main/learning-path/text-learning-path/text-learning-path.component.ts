import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { EditorModule } from 'primeng/editor';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { TextLearningPath } from '../../../../models/LearningPath/LearningPath';
import { ContextService } from '../../../../services/context.service';
import { LearningPathService } from '../../../../services/learning-path.service';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';
import { LearningPathGenerationStatusEnum } from '../../../../enums/LearningPathGenerationStatus.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AudioVoiceEnum } from '../../../../enums/AudioVoice.enum';
import { AudioVoicePipe } from '../../../../pipes/audio-voice.pipe';

@Component({
	selector: 'o-text-learning-path',
	imports: [
		MarkdownModule,
		MatButtonModule,
		MatIconModule,
		LoadingComponent,
		FormsModule,
		EditorModule,
		TooltipModule,
		TextButtonComponent,
		MatFormFieldModule,
		MatSelectModule,
		AudioVoicePipe,
	],
	templateUrl: './text-learning-path.component.html',
	styleUrl: './text-learning-path.component.scss',
})
export class TextLearningPathComponent {
	service: LearningPathService = inject(LearningPathService);
	markdownService: MarkdownService = inject(MarkdownService);
	ctx: ContextService = inject(ContextService);

	@Input() mode: 'edit' | 'study' = 'edit';

	text: string = '';
	isLoading: boolean = false;
	showAudios: boolean = false;
	numberOfAudios: number = 0;
	audioIndex: number = 0;
	audioStatusEnum = LearningPathGenerationStatusEnum;
	currentAudioStatus: LearningPathGenerationStatusEnum | null = null;
	readonly VOICES = Object.values(AudioVoiceEnum) as AudioVoiceEnum[];
	selectedVoice: AudioVoiceEnum = AudioVoiceEnum.ALLOY;

	readonly EDITOR_OPTIONS = [
		{ size: ['small', false, 'large', 'huge'] },
		'bold',
		'italic',
		'underline',
		'strike',
		'code',
		'code-block',
		'link',
		'script',
		'blockquote',
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		'formula',
	];

	get isTextMarkdown(): boolean {
		return !this.text.startsWith('<');
	}

	ngOnInit() {
		this.setData();
	}

	setData() {
		let textLearningPath = this.ctx.learningPathStudy!.learningPath as TextLearningPath;
		this.text = textLearningPath.text!;
		this.numberOfAudios = textLearningPath.numberOfAudios || 0;
		this.currentAudioStatus = textLearningPath.audioGenerationStatus;
	}

	getAudioUrl(number: number): string {
		return this.service.getAudioUrl(this.ctx.learningPathStudy!.learningPath.id, number);
	}

	nextAudio() {
		if (this.audioIndex < this.numberOfAudios - 1) {
			this.audioIndex++;
		}
	}

	previousAudio() {
		if (this.audioIndex > 0) {
			this.audioIndex--;
		}
	}

	async downloadPdf() {
		this.isLoading = true;
		await lastValueFrom(this.service.downloadPdf(this.ctx.learningPathStudy!.learningPath.id))
			.then((blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = this.ctx.learningPathStudy!.learningPath.name + '.pdf';
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async generateAudios() {
		this.isLoading = true;
		await lastValueFrom(
			this.service.regenerateAudios(this.ctx.learningPathStudy!.learningPath.id, this.selectedVoice),
		)
			.then((updatedLearningPath: TextLearningPath) => {
				this.ctx.learningPathStudy!.learningPath = updatedLearningPath;
				this.setData();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async save() {
		this.isLoading = true;
		await lastValueFrom(this.service.editTextLearningPath(this.ctx.learningPathStudy!.learningPath.id, this.text))
			.then((updatedLearningPath: TextLearningPath) => {
				this.ctx.learningPathStudy!.learningPath = updatedLearningPath;
				this.setData();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	reset() {
		this.setData();
	}
}
