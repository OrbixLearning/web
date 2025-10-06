import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { EditorModule } from 'primeng/editor';
import { lastValueFrom } from 'rxjs';
import { HighlightButtonComponent } from '../../../../components/buttons/highlight-button/highlight-button.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { TextLearningPath } from '../../../../models/LearningPath/LearningPath';
import { TextLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
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
		HighlightButtonComponent,
	],
	templateUrl: './text-learning-path.component.html',
	styleUrl: './text-learning-path.component.scss',
})
export class TextLearningPathComponent {
	@Input() learningPathStudy!: TextLearningPathStudy;
	@Input() mode: 'view' | 'study' = 'view';

	service: LearningPathService = inject(LearningPathService);
	markdownService: MarkdownService = inject(MarkdownService);

	startingText: string = '';
	htmlText: string = '';
	isLoading: boolean = false;

	ngOnInit() {
		this.startData();
	}

	startData() {
		this.htmlText = (this.learningPathStudy.learningPath as TextLearningPath).text!;
		this.startingText = this.htmlText;
	}

	async downloadPdf() {
		this.isLoading = true;
		await lastValueFrom(this.service.downloadPdf(this.learningPathStudy.learningPath.id))
			.then((blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = this.learningPathStudy.learningPath.name + '.pdf';
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async edit() {
		this.isLoading = true;
		await lastValueFrom(this.service.editTextLearningPath(this.learningPathStudy.learningPath.id, this.htmlText))
			.then((updatedLearningPath: TextLearningPath) => {
				this.learningPathStudy.learningPath = updatedLearningPath;
				this.htmlText = updatedLearningPath.text!;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
