import { Component, inject } from '@angular/core';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ContextService } from '../../../services/context.service';
import { ClassroomService } from '../../../services/classroom.service';
import { Classroom, SyllabusPreset } from '../../../models/Classroom';
import { LoadingComponent } from '../../loading/loading.component';
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'o-syllabus-preset-deletion-pop-up',
	imports: [PopUpHeaderComponent, MatCardModule, MatIconModule, MatButtonModule, LoadingComponent],
	templateUrl: './syllabus-preset-deletion-pop-up.component.html',
	styleUrl: './syllabus-preset-deletion-pop-up.component.scss',
})
export class SyllabusPresetDeletionPopUpComponent {
	ctx: ContextService = inject(ContextService);
	classroomService: ClassroomService = inject(ClassroomService);

	presets: SyllabusPreset[] = this.ctx.classroom?.presets || [];
	isLoading: boolean = false;

	async deletePreset(preset: SyllabusPreset) {
		this.presets = this.presets.filter(p => p !== preset);
		await lastValueFrom(this.classroomService.updatePresets(this.ctx.classroom!.id, this.presets))
			.then((c: Classroom) => {
				this.ctx.classroom = c;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
