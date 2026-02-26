import { InstitutionRoleEnum } from '../../enums/InstitutionRole.enum';
import { LearningPathGenerationStatusEnum } from '../../enums/LearningPathGenerationStatus.enum';
import { LearningPathTypeEnum } from '../../enums/LearningPathType.enum';
import { Classroom } from '../Classroom';
import { Question } from '../Question';
import { Syllabus } from '../Syllabus';
import { User } from '../User';
import { FlashCard } from './FlashCard';
import { LearningPathGeneration } from './LearningPathGeneration';
import { VideoDetails } from './VideoDetails';

export type LearningPath = VideoLearningPath | TextLearningPath | QuestionLearningPath | FlashCardLearningPath;

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
};

export type VideoLearningPath = {
	videos: VideoDetails[] | null;
} & LearningPathBase;

export type TextLearningPath = {
	text: string | null;
	numberOfAudios: number | null;
	audioGenerationStatus: LearningPathGenerationStatusEnum | null;
} & LearningPathBase;

export type FlashCardLearningPath = {
	flashCards: FlashCard[] | null;
} & LearningPathBase;

export type QuestionLearningPath = {
	questions: Question[] | null;
} & LearningPathBase;
