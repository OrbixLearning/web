import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { lastValueFrom } from 'rxjs';
import { UserAccount } from '../../../models/User';
import { ContextService } from '../../../services/context.service';
import { UserService } from '../../../services/user.service';
import { LoadingComponent } from '../../loading/loading.component';
import { ErrorPopUpComponent, ErrorPopUpData } from '../error-pop-up/error-pop-up.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-add-member-to-classroom-pop-up',
	imports: [
		MatInputModule,
		MatFormFieldModule,
		FormsModule,
		MatIconModule,
		MatButtonModule,
		LoadingComponent,
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		MatDialogModule,
		MatChipsModule,
	],
	templateUrl: './add-member-to-classroom-pop-up.component.html',
	styleUrl: './add-member-to-classroom-pop-up.component.scss',
})
export class AddMemberToClassroomPopUpComponent {
	dialogRef: MatDialogRef<AddMemberToClassroomPopUpComponent> = inject(MatDialogRef);
	ctx: ContextService = inject(ContextService);
	userService: UserService = inject(UserService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	selectedUsers: UserAccount[] = [];
	filteredUsers: UserAccount[] = [];
	showMessage: boolean = false;
	filter: string = '';

	async search() {
		this.isLoading = true;
		await lastValueFrom(this.userService.getUsersToAddToClassroom(this.ctx.classroom!.id!, this.filter))
			.then((r: UserAccount[]) => {
				this.filteredUsers = r;
			})
			.finally(() => {
				this.isLoading = false;
				this.showMessage = true;
			});
	}

	isAlreadySelected(user: UserAccount): boolean {
		return this.selectedUsers.some(u => u.id === user.id);
	}

	selectUser(user: UserAccount) {
		this.selectedUsers.push(user);
		this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
	}

	removeUser(user: UserAccount) {
		this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
	}

	async addUsersToClassroom() {
		this.isLoading = true;
		await lastValueFrom(
			this.userService.addUsersToClassroom(
				this.ctx.classroom!.id!,
				this.selectedUsers.map(u => u.id!),
			),
		)
			.then((r: { errorStrings: string[] }) => {
				let errors: string[] = r.errorStrings;
				if (errors.length > 0) {
					let data: ErrorPopUpData = {
						code: 409,
						message: errors.join(',\n'),
					};
					this.dialog
						.open(ErrorPopUpComponent, { data })
						.afterClosed()
						.subscribe(() => {
							this.dialogRef.close(true);
						});
				} else {
					this.dialogRef.close(true);
				}
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
