import { Classroom } from '../models/Classroom';
import { Institution } from '../models/Institution';

export class TutorialUtils {
	// CLASSROOM SETUP
	static classroomHasMissingSetup(classroom: Classroom): boolean {
		if (
			!classroom.setupComplete &&
			(classroom.syllabus.length === 0 ||
				classroom.documents.length === 0 ||
				(classroom.numberOfStudents !== undefined && classroom.numberOfStudents === 0))
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

	// INSTITUTION SETUP
	static institutionHasMissingSetup(institution: Institution): boolean {
		return !institution.setupComplete;
	}

	static currentInstitutionSetupStep(institution: Institution): number {
		if (TutorialUtils.institutionHasMissingSetup(institution)) {
			return 0;
		}
		throw new Error('Institution setup is complete, no current step.');
	}
}
