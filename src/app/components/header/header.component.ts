import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectModule } from 'primeng/select';
import { Institution } from '../../models/Institution';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'o-header',
	imports: [MatIconModule, MatButtonModule, SelectModule, FormsModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	isLoading: boolean = false;
	institutions: Institution[] = [
		{
			id: '0',
			name: 'Institution 1',
		},
		{
			id: '1',
			name: 'Institution 2',
		},
		{
			id: '2',
			name: 'Institution 3',
		},
		{
			id: '3',
			name: 'Institution 4',
		},
		{
			id: '4',
			name: 'Institution 5',
		},
		{
			id: '5',
			name: 'Institution 6',
		},
	];
	selectedInstitution?: Institution;

	toggleSidebar() {}
	onNotifications() {}
	onSettings() {}
	onProfile() {}
}
