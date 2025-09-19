import { Injectable } from '@angular/core';
import { Institution, InstitutionStyle } from '../models/Institution';

@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	private themeStyleElementId = 'institution-theme-style';
	private globalStyleId = 'global-theme-style';
	private currentGlobalTheme: 'light' | 'dark' = 'light';
	private GLOBAL_STYLE_KEY = 	'globalUserStyle';

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

		const globalStyleElement = document.getElementById(this.globalStyleId);
		if (globalStyleElement) {
			globalStyleElement.remove();
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

		if (institution.style){
			const themeClass: string = `theme-inst-${institution.id}`;
			document.body.classList.add(themeClass);
	
			const styleEl = document.createElement('style');
			styleEl.id = this.themeStyleElementId;
			styleEl.innerText = this.buildCssClass(themeClass, institution.style!);
			document.head.appendChild(styleEl);
		} else {
			this.applyLastGlobalTheme();
		}
	}

	setGlobalCustomTheme(style: InstitutionStyle) {
        this.clearThemes();
        const themeClass = 'theme-global-custom';
        document.body.classList.add(themeClass);
        
        const styleEl = document.createElement('style');
        styleEl.id = this.globalStyleId;
        styleEl.innerText = this.buildCssClass(themeClass, style);
        document.head.appendChild(styleEl);

        localStorage.setItem(this.GLOBAL_STYLE_KEY, JSON.stringify(style));
    }

	applySavedGlobalTheme() {
        const savedStyle = localStorage.getItem(this.GLOBAL_STYLE_KEY);
        if (savedStyle) {
            this.setGlobalCustomTheme(JSON.parse(savedStyle));
        } else {
            this.applyLastGlobalTheme();
        }
    }

	private applyLastGlobalTheme() {
        if (this.currentGlobalTheme === 'dark') {
            this.setDarkTheme();
        } else {
            this.setLightTheme();
        }
    }

	setBaseTheme() {
		this.clearThemes();
		localStorage.removeItem(this.GLOBAL_STYLE_KEY);
		document.body.classList.add('theme-base');
	}

	setDarkTheme() {
		this.clearThemes();
		localStorage.removeItem(this.GLOBAL_STYLE_KEY);
		document.body.classList.add('theme-dark');
		this.currentGlobalTheme = 'dark';
	}

	setLightTheme() {
		this.clearThemes();
		localStorage.removeItem(this.GLOBAL_STYLE_KEY);
		document.body.classList.add('theme-light');
		this.currentGlobalTheme = 'light';
	}

	getCurrentGlobalTheme(): 'light' | 'dark' {
		return this.currentGlobalTheme;
	}
}
