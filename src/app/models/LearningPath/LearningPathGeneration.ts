import { AudioVoiceEnum } from '../../enums/AudioVoice.enum';
import { LearningPathGenerationStatusEnum } from '../../enums/LearningPathGenerationStatus.enum';
import { QuestionTypeEnum } from '../../enums/QuestionType.enum';

export type LearningPathGeneration = {
	status: LearningPathGenerationStatusEnum;
	errorMessage: string | null;
	request: GenerateLearningPathRequest;
};

export type GenerateLearningPathRequest =
	| GenerateAudioLearningPathRequest
	| GenerateFlashCardLearningPathRequest
	| GenerateQuestionLearningPathRequest
	| GenerateTextLearningPathRequest
	| GenerateVideoLearningPathRequest;

export type GenerateAudioLearningPathRequest = {
	language: string;
	durationInSeconds: number;
	formality: string;
	voice: AudioVoiceEnum;
};

export type GenerateFlashCardLearningPathRequest = {
	language: string;
	numberOfCards: number;
	level: number;
};

export type GenerateQuestionLearningPathRequest = {
	language: string;
	numberOfQuestions: number;
	level: number;
	questionTypes: QuestionTypeEnum[];
};

export type GenerateTextLearningPathRequest = {
	language: string;
	useTopics: boolean;
	formality: string;
};

export type GenerateVideoLearningPathRequest = {
	numberOfVideos: number;
};
