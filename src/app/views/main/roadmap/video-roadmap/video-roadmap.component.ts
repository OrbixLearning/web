import { Component, Input } from '@angular/core';
import { VideoRoadmap } from '../../../../models/Roadmap';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';

@Component({
	selector: 'o-video-roadmap',
	imports: [SafeUrlPipe],
	templateUrl: './video-roadmap.component.html',
	styleUrl: './video-roadmap.component.scss',
})
export class VideoRoadmapComponent {
	@Input() roadmap!: VideoRoadmap;
}
