import { Syllabus } from '../Syllabus';

export type ClassroomCurrentScore = {
	syllabus: Syllabus;
	average: number;
	max: number;
	min: number;
	count: number;
};
