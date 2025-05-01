import { Classroom } from './Classroom';

export type Syllabus = {
	id: string;
	name: string;
	description: string;
	topics: Syllabus[];

	parent: Syllabus | null;
	classroom: Classroom | null;
};
