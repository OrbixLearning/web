import { Syllabus } from '../Syllabus';

export type StudentCurrentScore = {
	syllabus: Syllabus;
	value: number;
	comment: string;
	update: Date;
};
