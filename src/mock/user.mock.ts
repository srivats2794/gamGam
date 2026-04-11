import { UserProfile } from '../types/user';

export const mockUser: UserProfile = {
  id: 'user-001',
  name: 'Sarah',
  lifeStage: 'perimenopausal',
  symptoms: ['hot-flashes', 'sleep-problems', 'fatigue'],
  sensitivities: [],
  goals: ['sleep-better', 'manage-hot-flashes', 'feel-more-like-myself'],
  hasCommittedToRitual: false,
  wantsDailyReminder: false,
};

export const mockHasCompletedOnboarding = false;
