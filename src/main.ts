import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

declare var katex: any;
(window as any)['katex'] = katex;

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
