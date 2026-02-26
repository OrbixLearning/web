import { Classroom } from './Classroom';
import { Document } from './Document';
import { Question } from './Question';
import { Syllabus } from './Syllabus';

export type QuestionData = {
	id: string;
	question: Question;
	document: Document | null;
	classroom: Classroom;
	syllabus: Syllabus[];
};
