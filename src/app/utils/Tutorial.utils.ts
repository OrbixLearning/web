import { Classroom } from '../models/Classroom';

export class TutorialUtils {
	static hasMissingSetup(classroom: Classroom): boolean {
		if (
			classroom.syllabus.length === 0 ||
			classroom.documents.length === 0 ||
			(classroom.numberOfStudents !== undefined && classroom.numberOfStudents === 0)
		) {
			return true;
		}
		return false;
	}

	static currentClassroomSetupStep(classroom: Classroom): number {
		if (classroom.syllabus.length === 0) {
			return 0;
		} else if (classroom.documents.length === 0) {
			return 1;
		} else if (classroom.numberOfStudents !== undefined && classroom.numberOfStudents === 0) {
			return 2;
		}
		throw new Error('Classroom setup is complete, no current step.');
	}
}
