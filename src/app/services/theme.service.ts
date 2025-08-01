import { Injectable } from '@angular/core';
import { Institution, InstitutionStyle } from '../models/Institution';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	private themeStyleElementId = 'institution-theme-style';

	private clearThemes() {
		document.body.classList.forEach(className => {
			if (className.startsWith('theme-')) {
				document.body.classList.remove(className);
			}
		});

		const styleElement = document.getElementById(this.themeStyleElementId);
		if (styleElement) {
			styleElement.remove();
		}
	}

	private buildCssClass(themeClass: string, style: InstitutionStyle): string {
		return `.${themeClass} {
        ${style.primaryColor ? `--primary-color: ${style.primaryColor};` : ''}
        ${style.secondaryColor ? `--secondary-color: ${style.secondaryColor};` : ''}
        ${style.backgroundColor ? `--background-color: ${style.backgroundColor};` : ''}
        ${style.textColor ? `--text-color: ${style.textColor};` : ''}
        ${style.theme ? `--theme: ${style.theme};` : ''}
        }`;
	}

	setInstitutionTheme(institution: Institution) {
		this.clearThemes();

		const themeClass: string = `theme-inst-${institution.id}`;
		document.body.classList.add(themeClass);

		const styleEl = document.createElement('style');
		styleEl.id = this.themeStyleElementId;
		styleEl.innerText = this.buildCssClass(themeClass, institution.style!);
		document.head.appendChild(styleEl);
	}

	setBaseTheme() {
		this.clearThemes();
		document.body.classList.add('theme-base');
	}

	setDarkTheme() {
		this.clearThemes();
		document.body.classList.add('theme-dark');
	}

	setLightTheme() {
		this.clearThemes();
		document.body.classList.add('theme-light');
	}
}
