import { AppNotification } from '../types/notification';
import { mockNotifications } from '../mock/notifications.mock';

let _notifications: AppNotification[] = [...mockNotifications];

export async function getNotifications(): Promise<AppNotification[]> {
  // Phase 2: replace with real push notification fetch
  return [..._notifications];
}

export async function markSeen(id: string): Promise<void> {
  _notifications = _notifications.map(n =>
    n.id === id ? { ...n, seen: true } : n
  );
}
