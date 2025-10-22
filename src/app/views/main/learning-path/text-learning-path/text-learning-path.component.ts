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
		this.text = (this.ctx.learningPathStudy!.learningPath as TextLearningPath).text!;
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

	async save() {
		this.isLoading = true;
		await lastValueFrom(this.service.editTextLearningPath(this.ctx.learningPathStudy!.learningPath.id, this.text))
			.then((updatedLearningPath: TextLearningPath) => {
				this.ctx.learningPathStudy!.learningPath = updatedLearningPath;
				this.text = updatedLearningPath.text!;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	reset() {
		this.setData();
	}
}
