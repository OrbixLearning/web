import { Injectable } from '@angular/core';
import { Institution, InstitutionStyle } from '../models/Institution';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	private themeStyleElementId = 'institution-theme-style';

	private clearThemes() {
		const root = document.documentElement;
		root.removeAttribute('data-theme');
		root.removeAttribute('style');
	}

	private buildStyleTokens(style: InstitutionStyle): Record<string, string> {
		return {
			'primary-color': style.primaryColor,
			'secondary-color': style.secondaryColor,
			'background-color': style.backgroundColor,
			'text-color': style.textColor,
			'theme': style.theme,
		};
	}

	setInstitutionTheme(institution: Institution) {
		this.clearThemes();

		const themeClass: string = `theme-inst-${institution.id}`;
		const root = document.documentElement;
		root.setAttribute('data-theme', themeClass);
		const styleTokens = this.buildStyleTokens(institution.style!);

		Object.entries(styleTokens).forEach(([k, v]) => {
			root.style.setProperty(`--${k}`, v);
		});
	}

	setDarkTheme() {
		this.clearThemes();
		const root = document.documentElement;
		root.setAttribute('data-theme', 'dark');
	}

	setLightTheme() {
		this.clearThemes();
		const root = document.documentElement;
		root.setAttribute('data-theme', 'light');
	}

	setBaseTheme() {
		this.clearThemes();
	}
}
