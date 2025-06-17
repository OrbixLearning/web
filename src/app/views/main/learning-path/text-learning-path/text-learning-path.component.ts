import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { TextLearningPath } from '../../../../models/LearningPath/LearningPath';
import { TextLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
import { LearningPathService } from '../../../../services/learning-path.service';

@Component({
	selector: 'o-text-learning-path',
	imports: [MarkdownModule, MatButtonModule, MatIconModule, LoadingComponent],
	templateUrl: './text-learning-path.component.html',
	styleUrl: './text-learning-path.component.scss',
})
export class TextLearningPathComponent {
	@Input() learningPathStudy!: TextLearningPathStudy;

	service: LearningPathService = inject(LearningPathService);

	text: string = '';
	isLoading: boolean = false;

	ngOnInit() {
		this.text = (this.learningPathStudy.learningPath as TextLearningPath).text!;
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
}
