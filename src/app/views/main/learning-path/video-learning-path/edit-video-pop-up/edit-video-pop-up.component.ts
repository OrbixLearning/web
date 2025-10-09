import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VideoDetails } from '../../../../../models/LearningPath/VideoDetails';
import { PopUpHeaderComponent } from '../../../../../components/pop-ups/pop-up-header/pop-up-header.component';
import { PopUpButtonsComponent } from '../../../../../components/pop-ups/pop-up-buttons/pop-up-buttons.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafeUrlPipe } from '../../../../../pipes/safe-url.pipe';

@Component({
	selector: 'o-edit-video-pop-up',
	imports: [
		SafeUrlPipe,
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: './edit-video-pop-up.component.html',
	styleUrl: './edit-video-pop-up.component.scss',
})
export class EditVideoPopUpComponent {
	data: { video: VideoDetails; index: number } | undefined = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditVideoPopUpComponent>);

	form = this.formBuilder.group({
		videoId: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]{11}$/)]],
		name: ['', Validators.required],
		author: ['', Validators.required],
		description: [''],
		index: [1, Validators.min(1)],
	});

	ngOnInit() {
		this.startForm();
	}

	getUrl(videoId: string): string {
		return `https://www.youtube.com/embed/${videoId}`;
	}

	isValidVideoId(id?: string | null): boolean {
		return !!id && /^[A-Za-z0-9_-]{11}$/.test(id);
	}

	startForm() {
		if (this.data) {
			this.form.patchValue({
				videoId: this.data.video.videoId,
				name: this.data.video.name,
				author: this.data.video.author,
				description: this.data.video.description,
				index: this.data.index + 1,
			});
		}
	}

	onSubmit() {
		if (this.form.valid) {
			const video: VideoDetails = {
				videoId: this.form.value.videoId!,
				name: this.form.value.name!,
				author: this.form.value.author!,
				description: this.form.value.description || '',
			};
			this.dialogRef.close({ video, index: this.form.value.index! - 1 });
		}
	}
}
