import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { lastValueFrom, Observable } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import {
	SyllabusTopicCreationPopUpComponent,
	SyllabusTopicCreationPopUpData,
	SyllabusTopicCreationPopUpResult,
} from '../../../../components/pop-ups/syllabus-topic-creation-pop-up/syllabus-topic-creation-pop-up.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { Classroom } from '../../../../models/Classroom';
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
		let call: Observable<Syllabus[]> = this.hadSyllabus
			? this.syllabusService.update(this.syllabus!)
			: this.syllabusService.create(this.ctx.classroom!.id, this.syllabus!);
		await lastValueFrom(call)
			.then(async (syllabus: Syllabus[]) => {
				this.syllabus = syllabus;
				this.hadSyllabus = true;
				this.ctx.classroom!.syllabus = syllabus;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
