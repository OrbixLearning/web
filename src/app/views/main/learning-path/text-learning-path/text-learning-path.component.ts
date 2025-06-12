import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { TextRoadmap } from '../../../../models/LearningPath';
import { TextRoadmapStudy } from '../../../../models/LearningPathStudy';
import { RoadmapService } from '../../../../services/learning-path.service';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'o-text-roadmap',
	imports: [MarkdownModule, MatButtonModule, MatIconModule, LoadingComponent],
	templateUrl: './text-learning-path.component.html',
	styleUrl: './text-learning-path.component.scss',
})
export class TextRoadmapComponent {
	@Input() roadmapStudy!: TextRoadmapStudy;

	service: RoadmapService = inject(RoadmapService);

	text: string = '';
	isLoading: boolean = false;

	ngOnInit() {
		this.text = (this.roadmapStudy.roadmap as TextRoadmap).text;
	}

	async downloadPdf() {
		this.isLoading = true;
		await lastValueFrom(this.service.downloadPdf(this.roadmapStudy.roadmap.id))
			.then((blob: Blob) => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = this.roadmapStudy.roadmap.name + '.pdf';
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
