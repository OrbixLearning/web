import { Component, inject } from '@angular/core';
import { ContextService } from '../../../services/context.service';
import { SyllabusComponent } from '../../syllabus/syllabus.component';

@Component({
	selector: 'o-syllabus-viewer-pop-up',
	imports: [SyllabusComponent],
	templateUrl: './syllabus-viewer-pop-up.component.html',
	styleUrl: './syllabus-viewer-pop-up.component.scss',
})
export class SyllabusViewerPopUpComponent {
	ctx: ContextService = inject(ContextService);

	get syllabus() {
		return this.ctx.classroom?.syllabus;
	}

	get presets() {
		return this.ctx.classroom?.presets;
	}
}
