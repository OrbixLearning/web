import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Classroom, SyllabusPreset } from '../../models/Classroom';
import { Syllabus } from '../../models/Syllabus';
import { ClassroomService } from '../../services/classroom.service';
import { ContextService } from '../../services/context.service';
import { SyllabusService } from '../../services/syllabus.service';
import { download } from '../../utils/Download.util';
import { TreeUtils } from '../../utils/Tree.utils';
import { HighlightButtonComponent } from '../buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';
import { ConfirmPopUpComponent, ConfirmPopUpData } from '../pop-ups/confirm-pop-up/confirm-pop-up.component';
import {
	EditSyllabusTopicPopUpComponent,
	EditSyllabusTopicPopUpResult,
} from '../pop-ups/edit-syllabus-topic-pop-up/edit-syllabus-topic-pop-up.component';
import {
	SyllabusPresetCreationPopUpComponent,
	SyllabusPresetCreationPopUpData,
	SyllabusPresetCreationPopUpResult,
} from '../pop-ups/syllabus-preset-creation-pop-up/syllabus-preset-creation-pop-up.component';
import { SyllabusPresetDeletionPopUpComponent } from '../pop-ups/syllabus-preset-deletion-pop-up/syllabus-preset-deletion-pop-up.component';
import {
	SyllabusTopicCreationPopUpComponent,
	SyllabusTopicCreationPopUpData,
	SyllabusTopicCreationPopUpResult,
} from '../pop-ups/syllabus-topic-creation-pop-up/syllabus-topic-creation-pop-up.component';
import { SyllabusComponent } from '../syllabus/syllabus.component';

@Component({
	selector: 'o-syllabus-editor',
	imports: [
		HighlightButtonComponent,
		MatButtonModule,
		MatIconModule,
		SyllabusComponent,
		FileUploadModule,
		TextButtonComponent,
	],
	templateUrl: './syllabus-editor.component.html',
	styleUrl: './syllabus-editor.component.scss',
})
export class SyllabusEditorComponent {
	ctx: ContextService = inject(ContextService);
	service: SyllabusService = inject(SyllabusService);
	classroomService: ClassroomService = inject(ClassroomService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	hadSyllabus: boolean = this.ctx.classroom?.syllabus ? true : false;
	syllabus: Syllabus[] | undefined = this.ctx.classroom?.syllabus
		? Object.assign([], this.ctx.classroom?.syllabus)
		: undefined;
	MAX_FILE_SIZE: number = environment.MAX_PDF_SIZE;
	syllabusDocument?: File;

	get disableSyllabusSaveButton(): boolean {
		if (this.isLoading) {
			return true;
		}
		if (!this.syllabus || this.syllabus.length === 0) {
			return true;
		}
		if (!this.hadSyllabus && !this.syllabus) {
			return true;
		}
		return false;
	}

	get isSyllabusDocumentJson(): boolean {
		return this.syllabusDocument?.name.split('.').pop()?.toLowerCase() === 'json';
	}

	get presets(): SyllabusPreset[] {
		return this.ctx.classroom?.presets || [];
	}

	addSyllabusTopic() {
		let data: SyllabusTopicCreationPopUpData = {
			syllabus: this.syllabus,
		};
		this.dialog
			.open(SyllabusTopicCreationPopUpComponent, {
				data,
				minWidth: '500px',
				disableClose: true,
			})
			.afterClosed()
			.subscribe(async (result: SyllabusTopicCreationPopUpResult | undefined) => {
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
					await this.updateSyllabus();
				}
			});
	}

	addSyllabusPreset() {
		let data: SyllabusPresetCreationPopUpData = {
			syllabus: this.syllabus || [],
		};
		this.dialog
			.open(SyllabusPresetCreationPopUpComponent, {
				data,
				minWidth: '500px',
				disableClose: true,
			})
			.afterClosed()
			.subscribe(async (result: SyllabusPresetCreationPopUpResult | undefined) => {
				if (result) {
					const preset: SyllabusPreset = {
						name: result.name,
						syllabusIds: result.syllabus.map(s => s.id!),
					};
					this.isLoading = true;
					const updatedPresets = [...this.presets, preset];
					await lastValueFrom(this.classroomService.updatePresets(this.ctx.classroom!.id, updatedPresets))
						.then((c: Classroom) => {
							this.ctx.classroom = c;
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	editSyllabus(s: Syllabus) {
		this.dialog
			.open(EditSyllabusTopicPopUpComponent, {
				data: s,
				minWidth: '500px',
			})
			.afterClosed()
			.subscribe(async (result: EditSyllabusTopicPopUpResult | undefined) => {
				if (result) {
					this.isLoading = true;
					await lastValueFrom(this.service.edit(s.id!, result.name, result.description))
						.then(() => {
							let oldSyllabus: Syllabus = TreeUtils.findItemById(this.syllabus!, s.id!, 'id', 'topics')!;
							oldSyllabus.name = result.name;
							oldSyllabus.description = result.description;
							this.syllabus = [...this.syllabus!]; // Trigger change detection
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	deleteSyllabus(s: Syllabus) {
		let data: ConfirmPopUpData = {
			title: `Tem certeza que deseja excluir ${s.name} e seus subtópicos?`,
			message: 'Essa ação não pode ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (result: boolean) => {
				if (result) {
					this.syllabus = TreeUtils.removeFromTree(this.syllabus!, [s], 'topics');
					await this.updateSyllabus();
				}
			});
	}

	deleteSyllabusPreset() {
		this.dialog.open(SyllabusPresetDeletionPopUpComponent, {
			minWidth: '500px',
		});
	}

	async updateSyllabus() {
		this.isLoading = true;
		await lastValueFrom(this.service.save(this.ctx.classroom!.id, this.syllabus!))
			.then(async (syllabus: Syllabus[]) => {
				this.syllabus = syllabus;
				this.hadSyllabus = true;
				this.ctx.classroom!.syllabus = syllabus;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async exportSyllabusJson() {
		this.isLoading = true;
		await lastValueFrom(this.service.downloadSyllabusJson(this.ctx.classroom!.id))
			.then((blob: Blob) => {
				download(blob, `Ementa-${this.ctx.classroom!.name}.json`);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async downloadDefaultJson() {
		this.isLoading = true;
		await lastValueFrom(this.service.dowloadDefaultSyllabusJson())
			.then((blob: Blob) => {
				download(blob, 'Ementa-padrao.exemplo.json');
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	selectSyllabusDocument(event: FileSelectEvent) {
		this.syllabusDocument = event.currentFiles[0];
	}

	async validateSyllabusDocumentJson(): Promise<boolean> {
		if (this.isSyllabusDocumentJson) {
			this.isLoading = true;
			return (
				await lastValueFrom(this.service.validateJsonFormat(this.syllabusDocument!)).finally(() => {
					this.isLoading = false;
				})
			).valid;
		} else {
			return false;
		}
	}

	async uploadSyllabusDocument() {
		if (this.isSyllabusDocumentJson) {
			let confirmed: boolean = true;
			await this.validateSyllabusDocumentJson().then(async valid => {
				if (!valid) {
					const data: ConfirmPopUpData = {
						title: 'O documento JSON não segue o formato padrão. Deseja continuar mesmo assim?',
						message:
							'Ao continuar, a ementa será gerada por uma IA que usará o conteúdo do arquivo como referência. O resultado pode não ser perfeito.',
						confirmButton: 'Continuar',
					};
					await lastValueFrom(this.dialog.open(ConfirmPopUpComponent, { data }).afterClosed()).then(
						(result: boolean) => {
							confirmed = result;
						},
					);
				}
			});
			if (!confirmed) return;
		}

		this.isLoading = true;
		await lastValueFrom(
			this.classroomService.uploadSyllabusDocument(this.ctx.classroom!.id, this.syllabusDocument!),
		)
			.then((c: Classroom) => {
				this.ctx.classroom = c;
				this.syllabus = c.syllabus; // Trigger change detection
				this.syllabusDocument = undefined;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
