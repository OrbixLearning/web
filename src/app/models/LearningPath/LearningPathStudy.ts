import { LearningPath } from './LearningPath';
import { User } from '../User';

export type LearningPathStudy =
	| VideoLearningPathStudy
	| TextLearningPathStudy
	| QuestionLearningPathStudy
	| FlashCardLearningPathStudy;

type LearningPathStudyBase = {
	id: string;
	learningPath: LearningPath;
	user: User;
};

export type VideoLearningPathStudy = {} & LearningPathStudyBase;

export type TextLearningPathStudy = {} & LearningPathStudyBase;

export type FlashCardLearningPathStudy = {
	cardsOrder: number[];
} & LearningPathStudyBase;

export type QuestionLearningPathStudy = {
	userAnswers: AnsweredQuestion[];
} & LearningPathStudyBase;

export type AnsweredQuestion = {
	answer: string[];
};
