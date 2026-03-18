import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { EditorModule } from 'primeng/editor';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { MarkdownComponent } from '../../../../components/markdown/markdown.component';
import { AudioVoiceEnum } from '../../../../enums/AudioVoice.enum';
import { LearningPathGenerationStatusEnum } from '../../../../enums/LearningPathGenerationStatus.enum';
import { TextLearningPath } from '../../../../models/LearningPath/LearningPath';
import { AudioVoicePipe } from '../../../../pipes/audio-voice.pipe';
import { ContextService } from '../../../../services/context.service';
import { LearningPathService } from '../../../../services/learning-path.service';

@Component({
	selector: 'o-text-learning-path',
	imports: [
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
		MarkdownComponent,
	],
	templateUrl: './text-learning-path.component.html',
	styleUrl: './text-learning-path.component.scss',
})
export class TextLearningPathComponent {
	service: LearningPathService = inject(LearningPathService);
	ctx: ContextService = inject(ContextService);

	@Input() mode: 'edit' | 'study' = 'edit';

	text: string = '';
	htmlText: string = '';
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

	ngOnInit() {
		this.setData();
	}

	async setData() {
		let textLearningPath = this.ctx.learningPathStudy!.learningPath as TextLearningPath;
		this.text = textLearningPath.text!;
		this.numberOfAudios = textLearningPath.numberOfAudios || 0;
		this.currentAudioStatus = textLearningPath.audioGenerationStatus;
		await this.setHtmlText();
	}

	async setHtmlText() {
		this.isLoading = true;
		await lastValueFrom(this.service.getLearningPathTextInHtml(this.ctx.learningPathStudy!.learningPath.id))
			.then(response => {
				this.htmlText = response.htmlText;
			})
			.finally(() => {
				this.isLoading = false;
			});
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
		await lastValueFrom(
			this.service.editTextLearningPath(this.ctx.learningPathStudy!.learningPath.id, this.htmlText),
		)
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
