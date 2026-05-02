import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { Classroom } from '../../../../models/Classroom';
import { Document } from '../../../../models/Document';
import { Syllabus } from '../../../../models/Syllabus';
import { UserAccount } from '../../../../models/User';
import { ClassroomService } from '../../../../services/classroom.service';
import { ContextService } from '../../../../services/context.service';
import { TutorialUtils } from '../../../../utils/Tutorial.utils';
import { ClassroomDocumentsComponent } from '../classroom-documents/classroom-documents.component';
import { ClassroomMembersComponent } from '../classroom-members/classroom-members.component';
import { ClassroomSettingsComponent } from '../classroom-settings/classroom-settings.component';

export type SetupTutorial = {
	step: number;
	totalSteps: number;
	next: () => void;
	back: () => void;
	finish: () => void;
};

@Component({
	selector: 'o-classroom-setup',
	imports: [
		MatStepperModule,
		MatButtonModule,
		ClassroomSettingsComponent,
		ClassroomDocumentsComponent,
		ClassroomMembersComponent,
		LoadingComponent,
		SubHeaderComponent,
	],
	templateUrl: './classroom-setup.component.html',
	styleUrl: './classroom-setup.component.scss',
})
export class ClassroomSetupComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);
	router: Router = inject(Router);
	service: ClassroomService = inject(ClassroomService);
	route: ActivatedRoute = inject(ActivatedRoute);

	@ViewChild('stepper') stepper?: MatStepper;

	readonly TOTAL_STEPS = 3;

	isLoading: boolean = false;
	syllabusSetupForm: FormGroup = this.formBuilder.group({
		syllabus: this.formBuilder.control<Syllabus[]>([], Validators.required),
	});
	documentsSetupForm: FormGroup = this.formBuilder.group({
		documents: this.formBuilder.control<Document[]>([]),
	});
	membersSetupForm: FormGroup = this.formBuilder.group({
		members: this.formBuilder.control<UserAccount[]>([]),
	});

	get step(): number {
		return this.stepper?.selectedIndex || 0;
	}

	set step(value: number) {
		if (this.stepper) {
			this.stepper.selectedIndex = value;
		}
	}

	get syllabusFormControl(): FormControl {
		return this.syllabusSetupForm.get('syllabus')! as FormControl;
	}

	get documentsFormControl(): FormControl {
		return this.documentsSetupForm.get('documents')! as FormControl;
	}

	get membersFormControl(): FormControl {
		return this.membersSetupForm.get('members')! as FormControl;
	}

	getSetupTutorial(step: number): SetupTutorial {
		return {
			step: step,
			totalSteps: this.TOTAL_STEPS,
			next: () => {
				this.nextStep();
			},
			back: () => {
				this.backStep();
			},
			finish: () => {
				this.finishSetup();
			},
		};
	}

	ngOnInit() {
		// This is used to update the data when the classroomId changes in the URL
		this.route.url.subscribe(url => {
			this.startData();
			this.step = TutorialUtils.currentClassroomSetupStep(this.ctx.classroom!);
		});
	}

	ngAfterViewInit() {
		this.step = TutorialUtils.currentClassroomSetupStep(this.ctx.classroom!);
	}

	startData() {
		this.syllabusFormControl.setValue(this.ctx.classroom!.syllabus);
		this.documentsFormControl.setValue(this.ctx.classroom!.documents);
	}

	nextStep() {
		if (this.step < this.TOTAL_STEPS - 1) {
			this.step++;
		}
	}

	backStep() {
		if (this.step > 0) {
			this.step--;
		}
	}

	goToStep(i: number) {
		if (i >= 0 && i < this.TOTAL_STEPS - 1) {
			this.step = i;
		}
	}

	async finishSetup() {
		this.isLoading = true;
		await lastValueFrom(this.service.completeSetup(this.ctx.classroom!.id))
			.then((classroom: Classroom) => {
				this.ctx.classroom = classroom;
				this.router.navigateByUrl('/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
