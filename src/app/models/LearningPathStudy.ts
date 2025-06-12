import { LearningPath } from './LearningPath';
import { User } from './User';

export type LearningPathStudy =
	| VideoLearningPathStudy
	| TextLearningPathStudy
	| QuestionLearningPathStudy
	| FlashCardLearningPathStudy
	| AudioLearningPathStudy;

type LearningPathStudyBase = {
	id: string;
	learningPath: LearningPath;
	user: User;
};

export type VideoLearningPathStudy = {} & LearningPathStudyBase;

export type TextLearningPathStudy = {} & LearningPathStudyBase;

export type FlashCardLearningPathStudy = {} & LearningPathStudyBase;

export type QuestionLearningPathStudy = {} & LearningPathStudyBase;

export type AudioLearningPathStudy = {} & LearningPathStudyBase;
