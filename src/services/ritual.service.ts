import { Ritual } from '../types/ritual';
import { UserProfile } from '../types/user';
import { ritualTemplatesBySymptom, fallbackRitualTemplate } from '../mock/ritual.mock';

let _rituals: Ritual[] = [];

export async function generateRitualsForProfile(profile: UserProfile): Promise<Ritual[]> {
  // Phase 2: call LLM to generate personalised rituals based on full profile
  const generated: Ritual[] = [];

  for (const symptom of profile.symptoms) {
    const template = ritualTemplatesBySymptom[symptom];
    if (template) {
      generated.push({
        ...template,
        id: `ritual-${symptom}`,
        profileId: profile.id,
        createdAt: new Date().toISOString(),
        hasCommitted: false,
        wantsDailyReminder: false,
      });
    }
  }

  if (generated.length === 0) {
    generated.push({
      ...fallbackRitualTemplate,
      id: 'ritual-fallback',
      profileId: profile.id,
      createdAt: new Date().toISOString(),
      hasCommitted: false,
      wantsDailyReminder: false,
    });
  }

  _rituals = generated;
  return getRituals();
}

export async function getRituals(): Promise<Ritual[]> {
  return _rituals.map(r => ({ ...r, steps: [...r.steps] }));
}

export async function getRitualById(id: string): Promise<Ritual | null> {
  const ritual = _rituals.find(r => r.id === id);
  return ritual ? { ...ritual, steps: [...ritual.steps] } : null;
}

export async function commitToRitual(id: string, wantsReminder: boolean, reminderTime?: string): Promise<void> {
  _rituals = _rituals.map(r =>
    r.id === id ? { ...r, hasCommitted: true, wantsDailyReminder: wantsReminder, reminderTime } : r
  );
}

export async function regenerateRitual(id: string, userFeedback: string): Promise<Ritual> {
  // Phase 2: pass id + userFeedback to LLM — it returns a new set of steps tailored to the feedback
  const ritual = _rituals.find(r => r.id === id);
  if (!ritual) throw new Error('Ritual not found');
  const updated = { ...ritual, createdAt: new Date().toISOString() };
  _rituals = _rituals.map(r => r.id === id ? updated : r);
  return { ...updated, steps: [...updated.steps] };
}

export async function addRitual(userInput: string): Promise<Ritual> {
  // Phase 2: pass userInput to LLM — it returns a name + steps based on what the user described
  // Phase 1: use the input as the name directly
  const name = userInput.length > 40 ? userInput.slice(0, 40).trimEnd() + '…' : userInput;
  const newRitual: Ritual = {
    id: `ritual-custom-${Date.now()}`,
    profileId: 'user-001',
    name,
    steps: [
      {
        id: `cn-1`,
        title: 'Morning herbal tea',
        grammieNote: 'Start simple. One cup in the morning, before the day takes over.',
        duration: '5 minutes',
      },
      {
        id: `cn-2`,
        title: '10-minute walk outside',
        grammieNote: 'Not for fitness. For your nervous system.',
        duration: '10 minutes',
      },
      {
        id: `cn-3`,
        title: 'Evening wind-down',
        grammieNote: 'Five minutes of quiet before bed. No agenda. Just stillness.',
        duration: '5 minutes',
      },
    ],
    createdAt: new Date().toISOString(),
    hasCommitted: false,
    wantsDailyReminder: false,
  };
  _rituals = [..._rituals, newRitual];
  return { ...newRitual, steps: [...newRitual.steps] };
}

export async function deleteRitual(id: string): Promise<void> {
  _rituals = _rituals.filter(r => r.id !== id);
}
