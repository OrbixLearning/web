import { Classroom } from './Classroom';

export type Syllabus = {
	id: string | null;
	name: string;
	topics: Syllabus[] | null;
	documents: Document[];

	classroom: Classroom | null;
};
