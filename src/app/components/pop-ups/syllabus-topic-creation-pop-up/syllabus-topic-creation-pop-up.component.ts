import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Syllabus } from '../../../models/Syllabus';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { TreeUtils } from '../../../utils/Tree.utils';

export type SyllabusTopicCreationPopUpData = {
	syllabus?: Syllabus[];
};

export type SyllabusTopicCreationPopUpResult = {
	topic: Syllabus;
	parent?: Syllabus;
	index: number;
};

@Component({
	selector: 'o-syllabus-topic-creation-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		MatFormFieldModule,
		MatDialogModule,
		MatSelectModule,
		MatInputModule,
		ReactiveFormsModule,
	],
	templateUrl: './syllabus-topic-creation-pop-up.component.html',
	styleUrl: './syllabus-topic-creation-pop-up.component.scss',
})
export class SyllabusTopicCreationPopUpComponent {
	data: SyllabusTopicCreationPopUpData = inject(MAT_DIALOG_DATA);
	formBuilder: FormBuilder = inject(FormBuilder);
	dialogRef: MatDialogRef<SyllabusTopicCreationPopUpComponent> = inject(
		MatDialogRef<SyllabusTopicCreationPopUpComponent>,
	);

	form: FormGroup = this.formBuilder.group({
		name: ['', Validators.required],
		parent: this.formBuilder.control<Syllabus | undefined>(undefined),
		index: [this.data.syllabus ? this.data.syllabus.length : 0, Validators.required],
	});
	showIndex: boolean =
		this.data.syllabus !== undefined && this.data.syllabus !== null && this.data.syllabus.length > 0;

	get parentSelector(): Syllabus[] {
		if (!this.data.syllabus) {
			return [];
		}
		return TreeUtils.flattenTree(this.data.syllabus!, 'topics');
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	parentChange() {
		const brothers: Syllabus[] | undefined | null =
			this.getFormControl('parent').value?.topics || this.data.syllabus;
		const hasBrothers: boolean = brothers !== undefined && brothers !== null && brothers.length > 0;

		if (hasBrothers) {
			this.getFormControl('index').setValue(this.data.syllabus!.length);
			this.showIndex = true;
		} else {
			this.getFormControl('index').setValue(0);
			this.showIndex = false;
		}
	}

	onSubmit() {
		if (this.form.valid) {
			const topic: Syllabus = {
				id: null,
				name: this.getFormControl('name').value,
				topics: [],
				documents: [],
				classroom: null,
			};
			const index: number = this.getFormControl('index').value;
			const parent: Syllabus | undefined = this.getFormControl('parent').value;
			this.dialogRef.close({
				topic,
				index,
				parent,
			} as SyllabusTopicCreationPopUpResult);
		}
	}
}
