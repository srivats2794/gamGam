import { Recommendation } from '../types/recommendation';
import { mockRecommendationsBySymptom } from '../mock/recommendations.mock';

export async function getRecommendations(symptom: string): Promise<Recommendation[]> {
  // Phase 2: replace with real API call
  return mockRecommendationsBySymptom[symptom] ?? [];
}
