import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { environment } from '../../../environments/environment';
import { ErrorPopUpComponent, ErrorPopUpData } from '../pop-ups/error-pop-up/error-pop-up.component';

@Component({
	selector: 'o-image-picker',
	imports: [DividerModule, FileUploadModule, MatIconModule, MatButtonModule],
	templateUrl: './image-picker.component.html',
	styleUrl: './image-picker.component.scss',
})
export class ImagePickerComponent {
	dialog: MatDialog = inject(MatDialog);

	@Input() imageUrl?: string;
	@Input() file?: File;
	@Output() fileChange: EventEmitter<File> = new EventEmitter<File>();

	preview: string | ArrayBuffer | null = null;

	onFileSelect(event: FileSelectEvent) {
		const fileTemp = event.currentFiles[0];
		if (fileTemp.size > environment.MAX_IMAGE_SIZE) {
			const data: ErrorPopUpData = {
				code: 413,
				message: `O tamanho do arquivo excede o limite máximo de ${environment.MAX_IMAGE_SIZE / 1048576} MB.`,
				buttonText: 'Ok',
			};
			this.dialog.open(ErrorPopUpComponent, { data });
		} else {
			this.file = fileTemp;
			if (this.file) {
				const reader = new FileReader();
				reader.onload = () => {
					this.preview = reader.result;
				};
				reader.readAsDataURL(this.file);
			}
			this.fileChange.emit(this.file);
		}
	}
}
