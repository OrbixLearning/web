import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { QuestionTypeEnum } from '../../enums/QuestionType.enum';
import { Question } from '../../models/Question';
import { QuestionData } from '../../models/QuestionData';
import { QuestionTypePipe } from '../../pipes/question-type.pipe';
import { QuestionUtils } from '../../utils/Question.utils';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';
import { SyllabusTagsComponent } from '../syllabus-tags/syllabus-tags.component';

@Component({
	selector: 'o-question-card',
	imports: [
		TextButtonComponent,
		QuestionTypePipe,
		MatCheckboxModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		PopoverModule,
		SyllabusTagsComponent,
		TooltipModule,
		MatIconModule,
		MatButtonModule,
	],
	templateUrl: './question-card.component.html',
	styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent {
	@ViewChild('syllabusInfoPO') syllabusInfoPO: any;

	@Input() question!: Question;
	@Input() questionData?: QuestionData;
	@Input() index?: number;
	@Input() selected: boolean = false;
	@Input() showSelect: boolean = true;
	@Input() showEdit: boolean = true;
	@Input() showRemove: boolean = true;
	@Input() showExport: boolean = false;
	@Input() clickable: boolean = false;

	@Output() select: EventEmitter<void> = new EventEmitter<void>();
	@Output() edit: EventEmitter<void> = new EventEmitter<void>();
	@Output() remove: EventEmitter<void> = new EventEmitter<void>();
	@Output() export: EventEmitter<void> = new EventEmitter<void>();
	@Output() onclick: EventEmitter<void> = new EventEmitter<void>();

	questionTypeEnum = QuestionTypeEnum;

	readonly QUESTION_TYPES = Object.values(QuestionTypeEnum) as QuestionTypeEnum[];

	get hasIndex(): boolean {
		return this.index !== undefined;
	}

	verifyAnswer(question: Question, currentAnswers: string[]): boolean {
		return QuestionUtils.verifyAnswer(question, currentAnswers);
	}
}
