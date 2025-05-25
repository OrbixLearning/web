import { Component } from '@angular/core';

export type UploadDocumentPopUpResponse = {
	name: string;
	syllabusIds: string[];
	file: File;
};

@Component({
	selector: 'o-upload-document-pop-up',
	imports: [],
	templateUrl: './upload-document-pop-up.component.html',
	styleUrl: './upload-document-pop-up.component.scss',
})
export class UploadDocumentPopUpComponent {}
