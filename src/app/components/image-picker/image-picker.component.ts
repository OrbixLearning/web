import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'o-image-picker',
	imports: [DividerModule, FileUploadModule, MatIconModule, MatButtonModule],
	templateUrl: './image-picker.component.html',
	styleUrl: './image-picker.component.scss',
})
export class ImagePickerComponent {
	@Input() imageUrl?: string;
	@Input() file?: File;
	@Output() fileChange: EventEmitter<File> = new EventEmitter<File>();

	readonly MAX_IMAGE_SIZE = environment.MAX_IMAGE_SIZE;
	preview: string | ArrayBuffer | null = null;

	onFileSelect(event: FileSelectEvent) {
		this.file = event.currentFiles[0];
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
