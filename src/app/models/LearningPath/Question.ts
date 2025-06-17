import { QuestionTypeEnum } from '../../enums/QuestionType.enum';

export type Question = {
	statement: string;
	options: string[];
	answers: string[];
	type: QuestionTypeEnum;
};
