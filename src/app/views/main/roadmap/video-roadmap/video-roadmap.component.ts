import { Component, Input } from '@angular/core';
import { VideoRoadmap } from '../../../../models/Roadmap';
import { VideoRoadmapStudy } from '../../../../models/RoadmapStudy';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';

@Component({
	selector: 'o-video-roadmap',
	imports: [SafeUrlPipe],
	templateUrl: './video-roadmap.component.html',
	styleUrl: './video-roadmap.component.scss',
})
export class VideoRoadmapComponent {
	@Input() roadmapStudy!: VideoRoadmapStudy;

	videoLinks: string[] = [];

	ngOnInit() {
		this.videoLinks = (this.roadmapStudy.roadmap as VideoRoadmap).videoLinks;
	}
}
