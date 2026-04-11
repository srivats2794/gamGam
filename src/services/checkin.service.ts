import { Checkin, CheckinOutcome } from '../types/checkin';
import { mockCheckins } from '../mock/checkin.mock';

let _checkins: Checkin[] = [...mockCheckins];

export async function getPendingCheckin(): Promise<Checkin | null> {
  // Phase 2: replace with real API call
  return _checkins.find(c => !c.completedAt) ?? null;
}

export async function completeCheckin(id: string, outcome: CheckinOutcome, notes?: string): Promise<void> {
  _checkins = _checkins.map(c =>
    c.id === id
      ? { ...c, completedAt: new Date().toISOString(), outcome, notes }
      : c
  );
}
