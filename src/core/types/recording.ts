export interface VoicePayloadRequest {
  mimeType: string;
  contentBase64: string;
}

export interface CreateRecordingRequest {
  durationMs?: number;
  expectedText: string;
  voice: VoicePayloadRequest;
}

export interface PatchRecordingRequest {
  durationMs?: number;
}

export type RecordingStatus = "READY" | "DELETED";

export type EvaluationStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

export interface EvaluationWord {
  expected: string;
  heard: string | null;
  correct: boolean;
  errorType: "missing" | "substitution" | "insertion" | "correct" | string;
  wordIndex: number;
  confidence: number;
}

export interface EvaluationScores {
  pace?: number;
  fluency?: number;
  accuracy?: number;
}

export interface EvaluationResponse {
  id: string;
  recordingId: string;
  status: EvaluationStatus;
  provider?: string;
  modelName?: string;
  promptVersion?: string;
  providerJobId?: string;
  heardText?: string;
  summary?: string;
  scores?: EvaluationScores;
  words?: EvaluationWord[];
  difficultWords?: string[];
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordingResponse {
  id: string;
  sessionId: string;
  childId: string;
  storyId: string;
  status: RecordingStatus;
  durationMs?: number;
  wordCount?: number;
  expectedText?: string;
  mimeType?: string;
  audioUrl?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
  evaluation?: EvaluationResponse;
  meteringData?: number[];
}
