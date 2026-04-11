import { Ritual } from '../types/ritual';
import { mockRitual } from '../mock/ritual.mock';

let _ritual: Ritual = { ...mockRitual };

export async function getRitual(): Promise<Ritual> {
  return { ..._ritual, steps: [..._ritual.steps] };
}

export async function commitToRitual(wantsReminder: boolean, reminderTime?: string): Promise<void> {
  _ritual = { ..._ritual, isActive: true };
}

export async function regenerateRitual(): Promise<Ritual> {
  // Phase 2: replace with real personalization call
  _ritual = { ...mockRitual, createdAt: new Date().toISOString() };
  return { ..._ritual, steps: [..._ritual.steps] };
}
