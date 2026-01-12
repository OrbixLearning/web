import { AudioVoiceEnum } from '../../enums/AudioVoice.enum';
import { LearningPathGenerationStatusEnum } from '../../enums/LearningPathGenerationStatus.enum';
import { QuestionTypeEnum } from '../../enums/QuestionType.enum';

export type LearningPathGeneration = {
	status: LearningPathGenerationStatusEnum;
	errorMessage: string | null;
	request: GenerateLearningPathRequest;
};

export type GenerateLearningPathRequest =
	| GenerateFlashCardLearningPathRequest
	| GenerateQuestionLearningPathRequest
	| GenerateTextLearningPathRequest
	| GenerateVideoLearningPathRequest;

export type GenerateFlashCardLearningPathRequest = {
	language: string;
	theme?: string;
	numberOfCards: number;
	level: number;
};

export type GenerateQuestionLearningPathRequest = {
	language: string;
	theme?: string;
	numberOfQuestions: number;
	level: number;
	questionTypes: QuestionTypeEnum[];
};

export type GenerateTextLearningPathRequest = {
	language: string;
	theme?: string;
	useTopics: boolean;
	formality: string;
	voice: AudioVoiceEnum;
};

export type GenerateVideoLearningPathRequest = {
	numberOfVideos: number;
};
