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
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'o-syllabus-preset-deletion-pop-up',
	imports: [PopUpHeaderComponent, PopUpButtonsComponent, MatCardModule, MatIconModule, MatButtonModule, LoadingComponent],
	templateUrl: './syllabus-preset-deletion-pop-up.component.html',
	styleUrl: './syllabus-preset-deletion-pop-up.component.scss',
})
export class SyllabusPresetDeletionPopUpComponent {
	ctx: ContextService = inject(ContextService);
	classroomService: ClassroomService = inject(ClassroomService);

	presets: SyllabusPreset[] = this.ctx.classroom?.presets || [];
	isLoading: boolean = false;
	private dialogRef = inject(MatDialogRef<SyllabusPresetDeletionPopUpComponent>);

	onClose() {
    	this.dialogRef.close();
  	}

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
