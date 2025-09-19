import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ContextService } from '../../../../services/context.service';

@Component({
    selector: 'o-classroom-dashboard',
    standalone: true,
    imports: [RouterOutlet, RouterModule, MatIconModule, MatTabsModule],
    templateUrl: './classroom-dashboard.component.html',
    styleUrl: './classroom-dashboard.component.scss',
})
export class ClassroomDashboardComponent {
    ctx: ContextService = inject(ContextService);
    router: Router = inject(Router);
    route: ActivatedRoute = inject(ActivatedRoute);

    navigateTo(path: string): void {
        this.router.navigate([path], { relativeTo: this.route });
    }

    isRouteActive(path: string): boolean {
        if (path === 'overview' && (this.router.url.endsWith('/dashboard') || this.router.url.endsWith('/dashboard/'))) {
            return true;
        }
        return this.router.url.includes(`/dashboard/${path}`);
    }
}