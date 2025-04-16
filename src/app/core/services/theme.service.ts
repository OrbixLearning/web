import { Injectable } from '@angular/core';
import { Institution } from '../../models/Institution';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  applyInstitutionTheme(institution: Institution) {
    const root = document.documentElement;

    root.style.setProperty(
      '--primary-color',
      institution.primaryColor || '#007bff'
    );

    root.style.setProperty(
      '--secondary-color',
      institution.secondaryColor || '#6c757d'
    );
  }
}
