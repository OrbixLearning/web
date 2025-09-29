import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { FilterMetadata } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { ClassroomCreationPopUpComponent } from '../../../../components/pop-ups/classroom-creation-pop-up/classroom-creation-pop-up.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { Classroom } from '../../../../models/Classroom';
import { Page } from '../../../../models/Page';
import { ClassroomService } from '../../../../services/classroom.service';
import { ContextService } from '../../../../services/context.service';

@Component({
	selector: 'o-institution-classrooms',
	imports: [
		MatButtonModule,
		MatIconModule,
		TableModule,
		FormsModule,
		RouterModule,
		LoadingComponent,
		InputTextModule,
		PopoverModule,
		SubHeaderComponent,
	],
	templateUrl: './institution-classrooms.component.html',
	styleUrl: './institution-classrooms.component.scss',
})
export class InstitutionClassroomsComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);
	service: ClassroomService = inject(ClassroomService);
	cd: ChangeDetectorRef = inject(ChangeDetectorRef);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	page?: Page<Classroom>;
	classrooms: Classroom[] = [];
	totalRecords: number = 0;
	selectedClassrooms: Classroom[] = [];
	paginationFirst: number = 0;

	get tableStyle() {
		return {
			'min-width': '50rem',
		};
	}

	get headerButtons(): SubHeaderButton[] {
		let buttons: SubHeaderButton[] = [];
		buttons.push({
			text: 'Criar turmas',
			icon: 'add',
			function: () => this.createClassroom(),
			highlighted: true,
		});
		buttons.push({
			text: 'Excluir turmas',
			icon: 'delete',
			function: () => this.deleteSelectedClassrooms(),
			highlighted: false,
			disabled: this.selectedClassrooms.length === 0,
		});
		return buttons;
	}

	async getClassrooms(event?: TableLazyLoadEvent) {
		if (!this.ctx.institution?.id) return;

		let page;
		let size;
		if (event?.first !== undefined && event?.rows != undefined) {
			page = event.first / event.rows;
			size = event.rows;
		} else {
			page = this.page?.number || 0;
			size = this.page?.size || 10;
		}

		let nameFilter: string = (event?.filters?.['name'] as FilterMetadata)?.value || '';

		this.isLoading = true;
		this.cd.detectChanges();
		await lastValueFrom(this.service.getInstitutionClassrooms(this.ctx.institution.id, page, size, nameFilter))
			.then((res: Page<Classroom>) => {
				this.page = res;
				this.classrooms = this.page.content;
				this.totalRecords = this.page.totalElements;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	createClassroom() {
		this.dialog
			.open(ClassroomCreationPopUpComponent)
			.afterClosed()
			.subscribe(async res => {
				if (res) {
					await this.getClassrooms();
				}
			});
	}

	deleteSelectedClassrooms() {
		let data: ConfirmPopUpData = {
			title: `Tem certeza que deseja excluir ${this.selectedClassrooms.length} turma${
				this.selectedClassrooms.length > 1 ? 's' : ''
			}?`,
			message: `Essa ação não pode ser desfeita!`,
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async r => {
				if (r) {
					this.isLoading = true;
					this.cd.detectChanges();
					await lastValueFrom(this.service.deleteClassrooms(this.selectedClassrooms.map(u => u.id)))
						.then(async () => {
							await this.ctx.loadClassroomList();
							this.selectedClassrooms = [];
							this.getClassrooms();
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	async updateClassroom(classroom: Classroom) {
		this.isLoading = true;
		this.cd.detectChanges();
		await lastValueFrom(this.service.update(classroom.id, classroom.name, classroom.icon))
			.then(async (c: Classroom) => {
				await this.ctx.loadClassroomList();
			})
			.catch(async () => {
				await this.getClassrooms();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
