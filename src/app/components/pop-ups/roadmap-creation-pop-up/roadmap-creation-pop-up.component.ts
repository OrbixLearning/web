import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { RoadmapTypeEnum } from '../../../enums/RoadmapType.enum';
import { Syllabus } from '../../../models/Syllabus';
import { ContextService } from '../../../services/context.service';
import { SyllabusComponent } from '../../syllabus/syllabus.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-roadmap-creation-pop-up',
	imports: [
		PopUpHeaderComponent,
		MatStepperModule,
		MatButtonModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		SyllabusComponent,
	],
	templateUrl: './roadmap-creation-pop-up.component.html',
	styleUrl: './roadmap-creation-pop-up.component.scss',
})
export class RoadmapCreationPopUpComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);

	isLoading: boolean = false;

	baseLastForm = {
		language: this.formBuilder.control<string>('pt-BR', Validators.required),
	};
	videoForm = {
		numberOfVideos: this.formBuilder.control<number>(5, Validators.required),
	};
	textForm = {
		numberOfParagraphs: this.formBuilder.control<number>(5, Validators.required),
		useTopics: this.formBuilder.control<boolean>(false, Validators.required),
		formality: this.formBuilder.control<string>('normal', Validators.required),
	};
	questionForm = {
		numberOfQuestions: this.formBuilder.control<number>(20, Validators.required),
		level: this.formBuilder.control<number>(0),
		questionTypes: this.formBuilder.control<string[]>(
			['multiple-choice', 'multiple-select', 'true-false', 'open-ended'],
			Validators.required,
		),
	};
	audioForm = {
		durationInSeconds: this.formBuilder.control<number>(3600, Validators.required),
		formality: this.formBuilder.control<string>('normal', Validators.required),
	};
	flashCardForm = {
		numberOfCards: this.formBuilder.control<number>(15, Validators.required),
		level: this.formBuilder.control<number>(0),
	};

	forms = this.formBuilder.array([
		this.formBuilder.group({
			syllabus: this.formBuilder.control<Syllabus[]>([], Validators.required),
		}),
		this.formBuilder.group({
			name: this.formBuilder.control<string>('', Validators.required),
			type: this.formBuilder.control<RoadmapTypeEnum>(RoadmapTypeEnum.TEXT, Validators.required),
		}),
		this.formBuilder.group(this.baseLastForm),
	]);

	getFormControl(i: number, name: string): FormControl {
		return this.forms.at(i).get(name) as FormControl;
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.getFormControl(0, 'syllabus').setValue(syllabus);
	}

	setLastFormGroup(group: any) {
		this.forms.removeAt(2);
		let completeGroupObject = Object.assign({}, this.baseLastForm, group);
		this.forms.push(this.formBuilder.group(completeGroupObject));
	}

	selectType(type: RoadmapTypeEnum) {
		switch (type) {
			case RoadmapTypeEnum.VIDEO:
				this.setLastFormGroup(this.videoForm);
				break;
			case RoadmapTypeEnum.TEXT:
				this.setLastFormGroup(this.textForm);
				break;
			case RoadmapTypeEnum.QUESTION:
				this.setLastFormGroup(this.questionForm);
				break;
			case RoadmapTypeEnum.AUDIO:
				this.setLastFormGroup(this.audioForm);
				break;
			case RoadmapTypeEnum.FLASH_CARD:
				this.setLastFormGroup(this.flashCardForm);
				break;
			default:
				this.setLastFormGroup({});
				break;
		}
		this.getFormControl(1, 'type').setValue(type);
	}

	createRoadmap() {
		if (this.forms.valid) {
			this.isLoading = true;
			// TODO: one call per type
			// add a switch to identify which method to call
		}
	}
}
