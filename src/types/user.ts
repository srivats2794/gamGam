export type LifeStage = 'teen' | 'premenopausal' | 'perimenopausal' | 'postmenopausal';

export interface UserProfile {
  id: string;
  name: string;
  lifeStage: LifeStage;
  symptoms: string[];
  sensitivities: string[];
  goals: string[];
  hasCommittedToRitual: boolean;
  wantsDailyReminder: boolean;
  reminderTime?: string;
}
