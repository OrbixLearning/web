import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { LearningPathTypeEnum } from '../../enums/LearningPathType.enum';
import { Classroom } from '../Classroom';
import { Syllabus } from '../Syllabus';
import { User } from '../User';
import { FlashCard } from './FlashCard';
import { LearningPathGeneration } from './LearningPathGeneration';
import { Question } from './Question';
import { VideoDetails } from './VideoDetails';

export type LearningPath =
	| VideoLearningPath
	| TextLearningPath
	| QuestionLearningPath
	| FlashCardLearningPath
	| AudioLearningPath;

type LearningPathBase = {
	id: string;
	name: string;
	language: string;
	shared: boolean;
	validated: boolean;
	syllabus: Syllabus[];
	creator: User;
	classroom: Classroom;
	userInstitutionRole: InstitutionRoleEnum;
	type: LearningPathTypeEnum;
	generation: LearningPathGeneration;
	createdAt: Date;
};

export type VideoLearningPath = {
	videos: VideoDetails[] | null;
} & LearningPathBase;

export type TextLearningPath = {
	text: string | null;
} & LearningPathBase;

export type FlashCardLearningPath = {
	flashCards: FlashCard[] | null;
} & LearningPathBase;

export type QuestionLearningPath = {
	questions: Question[] | null;
} & LearningPathBase;

export type AudioLearningPath = {
	numberOfAudios: number | null;
} & LearningPathBase;
