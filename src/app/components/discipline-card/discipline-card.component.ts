import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Syllabus } from '../../models/Syllabus';

@Component({
  selector: 'app-discipline-card',
  imports: [CommonModule, MatCardModule],
  templateUrl: './discipline-card.component.html',
  styleUrls: ['./discipline-card.component.scss'],
})
export class DisciplineCardComponent {
  @Input() discipline!: Syllabus;
  @Input() progress: number = 0;
  @Input() averageGrade: number = 0;
}