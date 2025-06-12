import { Component, Input } from '@angular/core';
import { VideoDetails, VideoRoadmap } from '../../../../models/LearningPath';
import { VideoRoadmapStudy } from '../../../../models/LearningPathStudy';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';
import { DividerModule } from 'primeng/divider';

@Component({
	selector: 'o-video-roadmap',
	imports: [SafeUrlPipe, DividerModule],
	templateUrl: './video-learning-path.component.html',
	styleUrl: './video-learning-path.component.scss',
})
export class VideoRoadmapComponent {
	@Input() roadmapStudy!: VideoRoadmapStudy;

	videos: VideoDetails[] = [];

	ngOnInit() {
		this.videos = (this.roadmapStudy.roadmap as VideoRoadmap).videos;
	}

	getUrl(videoId: string): string {
		return `https://www.youtube.com/embed/${videoId}`;
	}
}
