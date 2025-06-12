import { Component, Input } from '@angular/core';
import { VideoDetails, VideoLearningPath } from '../../../../models/LearningPath';
import { VideoLearningPathStudy } from '../../../../models/LearningPathStudy';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';
import { DividerModule } from 'primeng/divider';

@Component({
	selector: 'o-video-learning-path',
	imports: [SafeUrlPipe, DividerModule],
	templateUrl: './video-learning-path.component.html',
	styleUrl: './video-learning-path.component.scss',
})
export class VideoLearningPathComponent {
	@Input() learningPathStudy!: VideoLearningPathStudy;

	videos: VideoDetails[] = [];

	ngOnInit() {
		this.videos = (this.learningPathStudy.learningPath as VideoLearningPath).videos;
	}

	getUrl(videoId: string): string {
		return `https://www.youtube.com/embed/${videoId}`;
	}
}
