import { Component, Input } from '@angular/core';
import { VideoRoadmap } from '../../../../models/Roadmap';

@Component({
	selector: 'o-video-roadmap',
	imports: [],
	templateUrl: './video-roadmap.component.html',
	styleUrl: './video-roadmap.component.scss',
})
export class VideoRoadmapComponent {
	@Input() roadmap!: VideoRoadmap;
}
