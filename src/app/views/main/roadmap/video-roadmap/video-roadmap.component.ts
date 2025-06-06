import { Component, Input } from '@angular/core';
import { VideoDetails, VideoRoadmap } from '../../../../models/Roadmap';
import { VideoRoadmapStudy } from '../../../../models/RoadmapStudy';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';
import { DividerModule } from 'primeng/divider';

@Component({
	selector: 'o-video-roadmap',
	imports: [SafeUrlPipe, DividerModule],
	templateUrl: './video-roadmap.component.html',
	styleUrl: './video-roadmap.component.scss',
})
export class VideoRoadmapComponent {
	@Input() roadmapStudy!: VideoRoadmapStudy;

	videos: VideoDetails[] = [];

	ngOnInit() {
		this.videos = (this.roadmapStudy.roadmap as VideoRoadmap).videos;
	}
}
