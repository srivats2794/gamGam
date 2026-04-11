export interface RitualStep {
  id: string;
  title: string;
  grammieNote: string;
  duration?: string;
  tradition?: string;
}

export interface Ritual {
  id: string;
  profileId: string;
  steps: RitualStep[];
  createdAt: string;
  isActive: boolean;
}
