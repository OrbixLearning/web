import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'o-main',
  imports: [HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  service: AuthService = inject(AuthService);
  router: Router = inject(Router);

  async logout() {
    await lastValueFrom(this.service.logout()).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
