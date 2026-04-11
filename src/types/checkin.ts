export type CheckinType = 'symptom' | 'ritual';
export type CheckinOutcome = 'helped' | 'partially' | 'didnt-help' | 'skipped';

export interface Checkin {
  id: string;
  type: CheckinType;
  referenceId: string;
  dueAt: string;
  completedAt?: string;
  outcome?: CheckinOutcome;
  notes?: string;
}
