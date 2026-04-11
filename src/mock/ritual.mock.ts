import { Ritual } from '../types/ritual';

export const mockRitual: Ritual = {
  id: 'ritual-001',
  profileId: 'user-001',
  steps: [
    {
      id: 'step-001',
      title: 'Morning sage tea',
      grammieNote: 'First thing, before anything else. Let it steep for at least 5 minutes.',
      duration: '5 minutes',
      tradition: 'Mediterranean folk medicine',
    },
    {
      id: 'step-002',
      title: 'Flaxseed with breakfast',
      grammieNote: 'A tablespoon ground, stirred into whatever you\'re eating. You won\'t taste it.',
      duration: '1 minute',
      tradition: 'Ayurveda',
    },
    {
      id: 'step-003',
      title: '10-minute walk outside',
      grammieNote: 'Not for fitness. For your nervous system. Morning light is better if you can manage it.',
      duration: '10 minutes',
    },
    {
      id: 'step-004',
      title: 'Magnesium glycinate before bed',
      grammieNote: '300mg is enough. It takes a few weeks to notice — but most women do.',
      duration: '1 minute',
      tradition: 'Naturopathic medicine',
    },
  ],
  createdAt: '2026-04-11T08:00:00Z',
  isActive: true,
};
