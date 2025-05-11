import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { lastValueFrom } from 'rxjs';
import { RoadmapTypeEnum } from '../../../enums/RoadmapType.enum';
import { Roadmap } from '../../../models/Roadmap';
import { Syllabus } from '../../../models/Syllabus';
import { ContextService } from '../../../services/context.service';
import { RoadmapService } from '../../../services/roadmap.service';
import { SyllabusComponent } from '../../syllabus/syllabus.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { SuccessPopUpComponent, SuccessPopUpData } from '../success-pop-up/success-pop-up.component';

@Component({
	selector: 'o-roadmap-creation-pop-up',
	imports: [
		PopUpHeaderComponent,
		MatStepperModule,
		MatButtonModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		SyllabusComponent,
		MatInputModule,
		MatSelectModule,
		MatSlideToggleModule,
	],
	templateUrl: './roadmap-creation-pop-up.component.html',
	styleUrl: './roadmap-creation-pop-up.component.scss',
})
export class RoadmapCreationPopUpComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);
	service: RoadmapService = inject(RoadmapService);
	dialog: MatDialog = inject(MatDialog);
	dialogRef: MatDialogRef<RoadmapCreationPopUpComponent> = inject(MatDialogRef<RoadmapCreationPopUpComponent>);

	isLoading: boolean = false;
	roadmapTypeEnum = RoadmapTypeEnum;

	baseLastForm = {
		language: this.formBuilder.control<string>('pt-BR', Validators.required),
	};
	videoForm = {
		numberOfVideos: this.formBuilder.control<number>(5, Validators.required),
	};
	textForm = {
		numberOfParagraphs: this.formBuilder.control<number>(5, Validators.required),
		useTopics: this.formBuilder.control<boolean>(false, Validators.required),
		formality: this.formBuilder.control<string>('medium', Validators.required),
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
		formality: this.formBuilder.control<string>('medium', Validators.required),
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
		this.formBuilder.group({ ...this.baseLastForm, ...this.textForm }),
	]);

	getFormControl(i: number, name: string): FormControl {
		return this.forms.at(i).get(name) as FormControl;
	}

	roadmapTypeButtonClass(type: RoadmapTypeEnum): string {
		return this.getFormControl(1, 'type').value === type ? 'selected-roadmap-type-button' : 'roadmap-type-button';
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
			case RoadmapTypeEnum.FLASHCARD:
				this.setLastFormGroup(this.flashCardForm);
				break;
			default:
				this.setLastFormGroup({});
				this.getFormControl(1, 'type').reset();
				return;
		}
		this.getFormControl(1, 'type').setValue(type);
	}

	async createRoadmap() {
		if (this.forms.valid) {
			this.isLoading = true;

			let endpoint: string = '';
			let syllabusIds: string[] = [];
			this.getFormControl(0, 'syllabus').value.forEach((syllabus: Syllabus) => {
				syllabusIds.push(syllabus.id);
			});
			let name: string = this.getFormControl(1, 'name').value;
			let requestBody: any = { syllabusIds, name, language: this.getFormControl(2, 'language').value };

			switch (this.getFormControl(1, 'type').value) {
				case RoadmapTypeEnum.VIDEO:
					endpoint = 'video';
					requestBody = {
						...requestBody,
						numberOfVideos: this.getFormControl(2, 'numberOfVideos').value,
					};
					break;
				case RoadmapTypeEnum.TEXT:
					endpoint = 'text';
					requestBody = {
						...requestBody,
						numberOfParagraphs: this.getFormControl(2, 'numberOfParagraphs').value,
						useTopics: this.getFormControl(2, 'useTopics').value,
						formality: this.getFormControl(2, 'formality').value,
					};
					break;
				case RoadmapTypeEnum.AUDIO:
					endpoint = 'audio';
					requestBody = {
						...requestBody,
						durationInSeconds: this.getFormControl(2, 'durationInSeconds').value,
						formality: this.getFormControl(2, 'formality').value,
					};
					break;
				case RoadmapTypeEnum.FLASHCARD:
					endpoint = 'flashcard';
					requestBody = {
						...requestBody,
						numberOfCards: this.getFormControl(2, 'numberOfCards').value,
						level: this.getFormControl(2, 'level').value,
					};
					break;
				case RoadmapTypeEnum.QUESTION:
					endpoint = 'question';
					requestBody = {
						...requestBody,
						numberOfQuestions: this.getFormControl(2, 'numberOfQuestions').value,
						level: this.getFormControl(2, 'level').value,
						questionTypes: this.getFormControl(2, 'questionTypes').value,
					};
					break;
			}

			await lastValueFrom(this.service.generateRoadmap(requestBody, endpoint))
				.then((r: Roadmap) => {
					if (r) {
						let sucessPopUpData: SuccessPopUpData = {
							title: 'Trilha criada com sucesso!',
							message: 'A trilha foi criada com sucesso e está disponível na sua conta.',
							buttonText: 'Conferir!',
						};
						this.dialog
							.open(SuccessPopUpComponent, {
								data: sucessPopUpData,
							})
							.afterClosed()
							.subscribe(() => {
								this.dialogRef.close(r.id);
							});
					}
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
