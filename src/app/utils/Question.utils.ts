import { QuestionTypeEnum } from '../enums/QuestionType.enum';
import { Question } from '../models/Question';

export class QuestionUtils {
	static verifyAnswer(question: Question, currentAnswers: string[]): boolean {
		const correctAnswers = question.answers;

		if (currentAnswers.length !== correctAnswers.length) {
			return false;
		}

		// TODO: Verify open-ended answers
		if (question.type === QuestionTypeEnum.OPEN_ENDED) {
			return true;
		}

		return currentAnswers.every((answer: string) => correctAnswers.includes(answer));
	}
}
