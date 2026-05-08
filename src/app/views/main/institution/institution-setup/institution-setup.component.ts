import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { Classroom } from '../../../../models/Classroom';
import { Institution } from '../../../../models/Institution';
import { UserAccount } from '../../../../models/User';
import { ContextService } from '../../../../services/context.service';
import { InstitutionService } from '../../../../services/institution.service';
import { TutorialUtils } from '../../../../utils/Tutorial.utils';
import { SetupTutorial } from '../../classroom/classroom-setup/classroom-setup.component';

@Component({
	selector: 'o-institution-setup',
	imports: [LoadingComponent, MatStepperModule, SubHeaderComponent],
	templateUrl: './institution-setup.component.html',
	styleUrl: './institution-setup.component.scss',
})
export class InstitutionSetupComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);
	router: Router = inject(Router);
	service: InstitutionService = inject(InstitutionService);
	route: ActivatedRoute = inject(ActivatedRoute);

	@ViewChild('stepper') stepper?: MatStepper;

	readonly TOTAL_STEPS = 3;

	isLoading: boolean = false;
	whiteLabelSetupForm: FormGroup = this.formBuilder.group({
		whiteLabel: this.formBuilder.control<boolean>(false),
	});
	usersSetupForm: FormGroup = this.formBuilder.group({
		users: this.formBuilder.control<UserAccount[]>([]),
	});
	classroomsSetupForm: FormGroup = this.formBuilder.group({
		classrooms: this.formBuilder.control<Classroom[]>([]),
	});

	get step(): number {
		return this.stepper?.selectedIndex || 0;
	}

	set step(value: number) {
		if (this.stepper) {
			this.stepper.selectedIndex = value;
		}
	}

	get whiteLabelFormControl(): FormControl {
		return this.whiteLabelSetupForm.get('whiteLabel')! as FormControl;
	}

	get usersFormControl(): FormControl {
		return this.usersSetupForm.get('users')! as FormControl;
	}

	get classroomsFormControl(): FormControl {
		return this.classroomsSetupForm.get('classrooms')! as FormControl;
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
		// This is used to update the data when the institutionId changes in the URL
		this.route.url.subscribe(url => {
			this.startData();
			this.step = TutorialUtils.currentInstitutionSetupStep(this.ctx.institution!);
		});
	}

	ngAfterViewInit() {
		this.step = TutorialUtils.currentInstitutionSetupStep(this.ctx.institution!);
	}

	startData() {}

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
		await lastValueFrom(this.service.completeSetup(this.ctx.institution!.id!))
			.then((institution: Institution) => {
				this.ctx.institution = institution;
				this.router.navigateByUrl('/i/' + this.ctx.institution?.id);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
