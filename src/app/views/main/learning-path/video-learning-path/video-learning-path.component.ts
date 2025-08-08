import { Component, Input } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { VideoLearningPath } from '../../../../models/LearningPath/LearningPath';
import { VideoLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
import { VideoDetails } from '../../../../models/LearningPath/VideoDetails';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';

@Component({
	selector: 'o-video-learning-path',
	imports: [SafeUrlPipe, DividerModule],
	templateUrl: './video-learning-path.component.html',
	styleUrl: './video-learning-path.component.scss',
})
export class VideoLearningPathComponent {
	@Input() learningPathStudy!: VideoLearningPathStudy;
	@Input() mode: 'view' | 'study' = 'view';

	videos: VideoDetails[] = [];

	ngOnInit() {
		this.videos = (this.learningPathStudy.learningPath as VideoLearningPath).videos!;
	}

	getUrl(videoId: string): string {
		return `https://www.youtube.com/embed/${videoId}`;
	}
}
