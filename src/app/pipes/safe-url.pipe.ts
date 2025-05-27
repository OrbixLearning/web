import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
	name: 'safeUrl',
})
export class SafeUrlPipe implements PipeTransform {
	sanitizer: DomSanitizer = inject(DomSanitizer);

	transform(value: string, ...args: unknown[]): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(value);
	}
}
