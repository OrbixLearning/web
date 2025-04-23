import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
@Component({
	selector: 'o-main',
	imports: [HeaderComponent, SidebarComponent, RouterOutlet, MatSidenavModule],
	templateUrl: './main.component.html',
	styleUrl: './main.component.scss',
})
export class MainComponent {}
