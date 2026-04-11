export type NotificationType = 'symptom-checkin' | 'ritual-checkin' | 'daily-reminder' | 'lapsed';

export interface AppNotification {
  id: string;
  type: NotificationType;
  grammieMessage: string;
  deepLinkTo: string;
  scheduledFor: string;
  seen: boolean;
}
