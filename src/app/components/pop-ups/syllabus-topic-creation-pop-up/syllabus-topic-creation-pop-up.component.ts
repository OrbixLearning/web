import { Component, inject } from '@angular/core';
import { Syllabus } from '../../../models/Syllabus';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContextService } from '../../../services/context.service';

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
	ctx: ContextService = inject(ContextService);

	form: FormGroup = this.formBuilder.group({
		name: ['', Validators.required],
		description: [''],
		parent: this.formBuilder.control<Syllabus | undefined>(undefined),
		index: [this.data.syllabus ? this.data.syllabus.length : 0, Validators.required],
	});
	showIndex: boolean = false;

	get parentSelector(): Syllabus[] {
		if (!this.data.syllabus) {
			return [];
		}
		return this.getSyllabusList(this.data.syllabus!);
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	getSyllabusList(syllabus: Syllabus[]): Syllabus[] {
		let list: Syllabus[] = [];
		syllabus.forEach(topic => {
			list.push(topic);
			if (topic.topics) {
				list = list.concat(this.getSyllabusList(topic.topics));
			}
		});
		return list;
	}

	parentChange() {
		const parent: Syllabus | undefined = this.getFormControl('parent').value;
		if (parent && parent.topics.length !== 0) {
			this.getFormControl('index').setValue(parent.topics.length);
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
				description: this.getFormControl('description').value,
				topics: [],
				parent: this.getFormControl('parent').value,
				classroom: this.ctx.classroom!,
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
