
export enum Language {
  ENGLISH = 'English',
  KISWAHILI = 'Kiswahili',
  SHENG = 'Sheng'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: GroundingSource[];
}

export interface TranslationResult {
  original: string;
  translated: string;
  explanation: string;
  citations: string[];
}

export interface VideoAnalysisResult {
  summary: string;
  keyPoints: string[];
  warnings: string[];
}
