import { AppNotification } from '../types/notification';

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    type: 'symptom-checkin',
    grammieMessage: 'A few days ago I suggested sage tea for your hot flashes. I\'ve been wondering — did it help at all?',
    deepLinkTo: '/checkin/checkin-001',
    scheduledFor: '2026-04-11T09:00:00Z',
    seen: false,
  },
  {
    id: 'notif-002',
    type: 'daily-reminder',
    grammieMessage: 'Good morning. Your ritual is waiting for you.',
    deepLinkTo: '/ritual',
    scheduledFor: '2026-04-11T08:00:00Z',
    seen: false,
  },
];
