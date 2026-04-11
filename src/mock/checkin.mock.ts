import { Checkin } from '../types/checkin';

export const mockCheckins: Checkin[] = [
  {
    id: 'checkin-001',
    type: 'symptom',
    referenceId: 'rec-001',
    dueAt: '2026-04-11T09:00:00Z',
  },
  {
    id: 'checkin-002',
    type: 'ritual',
    referenceId: 'ritual-001',
    dueAt: '2026-04-11T09:00:00Z',
  },
];
