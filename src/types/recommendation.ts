export type ConfidenceLevel = 'research-backed' | 'community-validated' | 'traditional';

export interface Recommendation {
  id: string;
  title: string;
  grammieIntro: string;
  expandedDetail: string;
  confidence: ConfidenceLevel;
  researchLinks?: { label: string; url: string }[];
  communitySignal?: string;
  pregnancySafetyNote?: string;
  tradition?: string;
}
