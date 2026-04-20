import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { ContextService } from '../../../../services/context.service';
import { TutorialUtils } from '../../../../utils/Tutorial.utils';
import { ClassroomDocumentsComponent } from '../classroom-documents/classroom-documents.component';
import { ClassroomMembersComponent } from '../classroom-members/classroom-members.component';
import { ClassroomSettingsComponent } from '../classroom-settings/classroom-settings.component';
import { Syllabus } from '../../../../models/Syllabus';
import { Document } from '../../../../models/Document';
import { UserAccount } from '../../../../models/User';

@Component({
	selector: 'o-classroom-setup',
	imports: [
		MatStepperModule,
		MatButtonModule,
		ClassroomSettingsComponent,
		ClassroomDocumentsComponent,
		ClassroomMembersComponent,
	],
	templateUrl: './classroom-setup.component.html',
	styleUrl: './classroom-setup.component.scss',
})
export class ClassroomSetupComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);

	step: number = 0;
	syllabusSetupForm: FormGroup = this.formBuilder.group({
		syllabus: this.formBuilder.control<Syllabus[]>([], Validators.required),
	});
	documentsSetupForm: FormGroup = this.formBuilder.group({
		documents: this.formBuilder.control<Document[]>([]),
	});
	membersSetupForm: FormGroup = this.formBuilder.group({
		members: this.formBuilder.control<UserAccount[]>([]),
	});

	get syllabusFormControl(): FormControl {
		return this.syllabusSetupForm.get('syllabus')! as FormControl;
	}

	get documentsFormControl(): FormControl {
		return this.documentsSetupForm.get('documents')! as FormControl;
	}

	get membersFormControl(): FormControl {
		return this.membersSetupForm.get('members')! as FormControl;
	}

	ngOnInit() {
		this.startData();
	}

	startData() {
		this.step = TutorialUtils.currentClassroomSetupStep(this.ctx.classroom!);
		this.syllabusFormControl.setValue(this.ctx.classroom!.syllabus);
		this.documentsFormControl.setValue(this.ctx.classroom!.documents);
	}

	nextStep() {
		this.step++;
	}
}
