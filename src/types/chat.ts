import { Recommendation } from './recommendation';
import { Ritual } from './ritual';

export type ChatContext = 'symptom' | 'new-ritual' | 'modify-ritual';

export interface ChatMessage {
  role: 'grammie' | 'user';
  text: string;
}

export type ChatResult =
  | { context: 'symptom'; recommendations: Recommendation[] }
  | { context: 'new-ritual'; ritual: Ritual }
  | { context: 'modify-ritual'; ritual: Ritual };

export interface ChatResponse {
  reply: string;
  resolved: boolean;
  result?: ChatResult;
}
