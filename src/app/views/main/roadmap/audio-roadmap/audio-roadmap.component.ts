import { Component, Input } from '@angular/core';
import { AudioRoadmap } from '../../../../models/Roadmap';

@Component({
	selector: 'o-audio-roadmap',
	imports: [],
	templateUrl: './audio-roadmap.component.html',
	styleUrl: './audio-roadmap.component.scss',
})
export class AudioRoadmapComponent {
	@Input() roadmap!: AudioRoadmap;
}
