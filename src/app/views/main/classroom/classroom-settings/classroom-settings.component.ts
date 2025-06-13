import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import {
	SyllabusPresetCreationPopUpComponent,
	SyllabusPresetCreationPopUpData,
	SyllabusPresetCreationPopUpResult,
} from '../../../../components/pop-ups/syllabus-preset-creation-pop-up/syllabus-preset-creation-pop-up.component';
import { SyllabusPresetDeletionPopUpComponent } from '../../../../components/pop-ups/syllabus-preset-deletion-pop-up/syllabus-preset-deletion-pop-up.component';
import {
	SyllabusTopicCreationPopUpComponent,
	SyllabusTopicCreationPopUpData,
	SyllabusTopicCreationPopUpResult,
} from '../../../../components/pop-ups/syllabus-topic-creation-pop-up/syllabus-topic-creation-pop-up.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { Classroom, SyllabusPreset } from '../../../../models/Classroom';
import { Syllabus } from '../../../../models/Syllabus';
import { ClassroomService } from '../../../../services/classroom.service';
import { ContextService } from '../../../../services/context.service';
import { SyllabusService } from '../../../../services/syllabus.service';
import { TreeUtils } from '../../../../utils/Tree.utils';

@Component({
	selector: 'o-classroom-settings',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		LoadingComponent,
		SyllabusComponent,
		MatIconModule,
		RouterModule,
		DividerModule,
		FileUploadModule,
	],
	templateUrl: './classroom-settings.component.html',
	styleUrl: './classroom-settings.component.scss',
})
export class ClassroomSettingsComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);
	service: ClassroomService = inject(ClassroomService);
	syllabusService: SyllabusService = inject(SyllabusService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	form: FormGroup = this.formBuilder.group({});
	hadSyllabus: boolean = this.ctx.classroom?.syllabus ? true : false;
	syllabus: Syllabus[] | undefined = this.ctx.classroom?.syllabus;
	presets: SyllabusPreset[] | undefined = this.ctx.classroom?.presets;
	markedSyllabus: Syllabus[] = [];
	MAX_FILE_SIZE: number = environment.MAX_PDF_SIZE;
	syllabusDocument?: File;

	ngOnInit() {
		this.resetForm();
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	get disableInfosSaveButton(): boolean {
		if (this.isLoading) {
			return true;
		}
		if (this.form.invalid) {
			return true;
		}
		if (
			this.getFormControl('name').value === this.ctx.classroom?.name &&
			this.getFormControl('icon').value === this.ctx.classroom?.icon
		) {
			return true;
		}
		return false;
	}

	get disableSyllabusSaveButton(): boolean {
		if (this.isLoading) {
			return true;
		}
		if (!this.hadSyllabus && !this.syllabus) {
			return true;
		}
		return false;
	}

	addSyllabusTopic() {
		let data: SyllabusTopicCreationPopUpData = {
			syllabus: this.syllabus,
		};
		this.dialog
			.open(SyllabusTopicCreationPopUpComponent, {
				data,
			})
			.afterClosed()
			.subscribe((result: SyllabusTopicCreationPopUpResult | undefined) => {
				if (result) {
					let topic: Syllabus = result.topic;
					let parent: Syllabus | undefined = result.parent;
					let index: number = result.index;
					if (parent) {
						if (!parent.topics) parent.topics = [];
						parent.topics.splice(index, 0, topic);
					} else {
						this.syllabus!.splice(index, 0, topic);
					}
					this.syllabus = [...this.syllabus!]; // Trigger change detection
				}
			});
	}

	addSyllabusPreset() {
		let data: SyllabusPresetCreationPopUpData = {
			syllabus: this.syllabus || [],
		};
		this.dialog
			.open(SyllabusPresetCreationPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (result: SyllabusPresetCreationPopUpResult | undefined) => {
				if (result) {
					let preset: SyllabusPreset = {
						name: result.name,
						syllabusIds: result.syllabus.map(s => s.id!),
					};
					this.presets?.push(preset);
					this.isLoading = true;
					await lastValueFrom(this.service.updatePresets(this.presets!, this.ctx.classroom!.id)).finally(
						() => {
							this.isLoading = false;
						},
					);
				}
			});
	}

	deleteSyllabusPreset() {
		this.dialog
			.open(SyllabusPresetDeletionPopUpComponent)
			.afterClosed()
			.subscribe(() => {
				this.presets = this.ctx.classroom?.presets;
			});
	}

	resetForm() {
		this.form = this.formBuilder.group({
			name: [this.ctx.classroom?.name, Validators.required],
			icon: [this.ctx.classroom?.icon, Validators.required],
		});
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.update(
					this.ctx.classroom!.id,
					this.getFormControl('name').value,
					this.getFormControl('icon').value,
				),
			)
				.then(async (c: Classroom) => {
					await this.ctx.loadClassroomList().then(() => {
						this.ctx.classroom = c;
					});
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}

	deleteMarkedSyllabus() {
		let data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja excluir os tópicos selecionados?',
			message: 'Essa ação não pode ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (result: boolean) => {
				if (result) {
					this.syllabus = TreeUtils.removeFromTree(this.syllabus!, this.markedSyllabus, 'topics');
					this.markedSyllabus = [];
				}
			});
	}

	async updateSyllabus() {
		if (!this.syllabus) {
			let confirmedSyllabusDeletion = false;
			let data: ConfirmPopUpData = {
				title: 'Tem certeza que deseja excluir a ementa?',
				message: 'Essa ação não pode ser desfeita.',
				confirmButton: 'Excluir',
			};
			await lastValueFrom(this.dialog.open(ConfirmPopUpComponent, { data }).afterClosed()).then(r => {
				confirmedSyllabusDeletion = r;
			});
			if (!confirmedSyllabusDeletion) return;
		}
		this.isLoading = true;
		await lastValueFrom(this.syllabusService.save(this.ctx.classroom!.id, this.syllabus!))
			.then(async (syllabus: Syllabus[]) => {
				this.syllabus = syllabus;
				this.hadSyllabus = true;
				this.ctx.classroom!.syllabus = syllabus;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	selectSyllabusDocument(event: FileSelectEvent) {
		this.syllabusDocument = event.currentFiles[0];
	}

	async uploadSyllabusDocument() {
		if (this.ctx.classroom?.syllabus && this.ctx.classroom?.syllabus.length > 0) {
			const data: ConfirmPopUpData = {
				title: 'Tem certeza que deseja alterar a definição curricular?',
				message: 'A ementa atual será substituída.',
				confirmButton: 'Confirmar',
				cancelButton: 'Cancelar',
			};
			let confirmed: boolean = false;
			await lastValueFrom(this.dialog.open(ConfirmPopUpComponent, { data }).afterClosed()).then(
				(result: boolean) => {
					confirmed = result;
				},
			);
			if (!confirmed) return;
		}
		this.isLoading = true;
		await lastValueFrom(this.service.uploadSyllabusDocument(this.ctx.classroom!.id, this.syllabusDocument!))
			.then((c: Classroom) => {
				this.ctx.classroom = c;
				this.syllabus = c.syllabus; // Trigger change detection
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async deleteSyllabusDocument() {
		let data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja excluir este documento?',
			message: 'A ementa não será desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.service.deleteSyllabusDocument(this.ctx.classroom!.id))
						.then((c: Classroom) => {
							this.ctx.classroom = c;
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
