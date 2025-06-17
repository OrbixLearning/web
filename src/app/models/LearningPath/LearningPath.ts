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
	icon: string;
	language: string;
	shared: boolean;
	validated: boolean;
	syllabus: Syllabus[];
	creator: User;
	classroom: Classroom;
	userInstitutionRole: InstitutionRoleEnum;
	type: LearningPathTypeEnum;
	generation: LearningPathGeneration;
};

export type VideoLearningPath = {
	videos: VideoDetails[];
} & LearningPathBase;

export type TextLearningPath = {
	text: string;
} & LearningPathBase;

export type FlashCardLearningPath = {
	flashCards: FlashCard[];
} & LearningPathBase;

export type QuestionLearningPath = {
	questions: Question[];
} & LearningPathBase;

export type AudioLearningPath = {
	numberOfAudios: number;
} & LearningPathBase;
