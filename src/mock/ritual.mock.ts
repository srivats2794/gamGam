import { Ritual } from '../types/ritual';

export const ritualTemplatesBySymptom: Record<string, Omit<Ritual, 'id' | 'profileId' | 'createdAt' | 'hasCommitted' | 'wantsDailyReminder'>> = {
  'hot-flashes': {
    name: 'Hot Flash Ritual',
    steps: [
      {
        id: 'hf-1',
        title: 'Morning sage tea',
        grammieNote: 'First thing, before anything else. Let it steep for at least 5 minutes.',
        duration: '5 minutes',
        tradition: 'Mediterranean folk medicine',
      },
      {
        id: 'hf-2',
        title: 'Flaxseed with breakfast',
        grammieNote: 'A tablespoon ground, stirred into whatever you\'re eating. You won\'t taste it.',
        duration: '1 minute',
        tradition: 'Ayurveda',
      },
      {
        id: 'hf-3',
        title: 'Cooling breathwork when a flash hits',
        grammieNote: 'Inhale for 4, hold for 7, exhale for 8. Three rounds is enough.',
        duration: '2 minutes',
        tradition: 'Pranayama (Ayurveda)',
      },
    ],
  },
  'sleep-problems': {
    name: 'Sleep Ritual',
    steps: [
      {
        id: 'sl-1',
        title: 'Magnesium glycinate before bed',
        grammieNote: '300mg is enough. It takes a few weeks to notice, but most women do.',
        duration: '1 minute',
        tradition: 'Naturopathic medicine',
      },
      {
        id: 'sl-2',
        title: 'Ashwagandha with dinner',
        grammieNote: 'Take it with food. It works on the nervous system over time, not overnight.',
        duration: '1 minute',
        tradition: 'Ayurveda',
      },
      {
        id: 'sl-3',
        title: 'No screens 30 minutes before bed',
        grammieNote: 'Not forever. Just enough to let your nervous system remember what quiet feels like.',
        duration: '30 minutes',
      },
    ],
  },
  'anxiety': {
    name: 'Anxiety Ritual',
    steps: [
      {
        id: 'ax-1',
        title: '10-minute walk outside',
        grammieNote: 'Not for fitness. For your nervous system. Morning light is better if you can manage it.',
        duration: '10 minutes',
      },
      {
        id: 'ax-2',
        title: 'Lemon balm tea in the afternoon',
        grammieNote: 'A gentle herb. It takes the edge off without making you foggy.',
        duration: '5 minutes',
        tradition: 'European herbal medicine',
      },
      {
        id: 'ax-3',
        title: 'Body scan before sleep',
        grammieNote: 'Lie down and move your attention slowly from your feet upward. Five minutes is enough.',
        duration: '5 minutes',
        tradition: 'Mindfulness',
      },
    ],
  },
  'mood-swings': {
    name: 'Mood Support Ritual',
    steps: [
      {
        id: 'ms-1',
        title: 'Saffron with warm milk in the morning',
        grammieNote: 'A small pinch in warm milk. It sounds modest but the research on mood is real.',
        duration: '3 minutes',
        tradition: 'Persian medicine',
      },
      {
        id: 'ms-2',
        title: 'Omega-3 with breakfast',
        grammieNote: 'Fish oil or algae-based. Consistency matters more than the dose.',
        duration: '1 minute',
        tradition: 'Naturopathic medicine',
      },
      {
        id: 'ms-3',
        title: 'Five minutes of sunlight before 10am',
        grammieNote: 'Step outside. No sunglasses for just a few minutes. It sets your body clock and lifts the floor of your mood.',
        duration: '5 minutes',
      },
    ],
  },
  'fatigue': {
    name: 'Energy Ritual',
    steps: [
      {
        id: 'ft-1',
        title: 'Ashwagandha with breakfast',
        grammieNote: 'It works on your stress hormones over time. Give it a month before judging.',
        duration: '1 minute',
        tradition: 'Ayurveda',
      },
      {
        id: 'ft-2',
        title: 'Iron-rich food at lunch',
        grammieNote: 'Lentils, spinach, red meat if you eat it. Pair with something with vitamin C to help absorption.',
        duration: '0 minutes',
      },
      {
        id: 'ft-3',
        title: 'Short walk after lunch',
        grammieNote: 'Ten minutes is enough to break the afternoon slump. Outside if you can.',
        duration: '10 minutes',
      },
    ],
  },
  'joint-pain': {
    name: 'Joint Support Ritual',
    steps: [
      {
        id: 'jp-1',
        title: 'Turmeric with black pepper in warm water',
        grammieNote: 'The black pepper matters. Without it, turmeric barely absorbs. A quarter teaspoon of each, every morning.',
        duration: '3 minutes',
        tradition: 'Ayurveda',
      },
      {
        id: 'jp-2',
        title: 'Gentle movement before getting up',
        grammieNote: 'Before you stand, rotate your ankles and wrists. Let your joints warm up before you ask them to carry you.',
        duration: '3 minutes',
      },
      {
        id: 'jp-3',
        title: 'Epsom salt soak twice a week',
        grammieNote: 'Magnesium absorbed through the skin. Twenty minutes in warm water with two cups of salts.',
        duration: '20 minutes',
        tradition: 'Folk medicine',
      },
    ],
  },
  'brain-fog': {
    name: 'Mental Clarity Ritual',
    steps: [
      {
        id: 'bf-1',
        title: 'Lion\'s mane mushroom in the morning',
        grammieNote: 'Add it to coffee or take it as a capsule. The research on focus is early but promising.',
        duration: '1 minute',
        tradition: 'TCM',
      },
      {
        id: 'bf-2',
        title: 'No caffeine after midday',
        grammieNote: 'Caffeine stays in your system for six hours. Afternoon coffee is often the reason for poor sleep and next-day fog.',
        duration: '0 minutes',
      },
      {
        id: 'bf-3',
        title: 'Cold water on your face and wrists in the afternoon',
        grammieNote: 'It sounds simple because it is. Thirty seconds of cold water when the fog sets in.',
        duration: '1 minute',
      },
    ],
  },
  'bloating': {
    name: 'Digestive Ritual',
    steps: [
      {
        id: 'bl-1',
        title: 'Fennel tea after meals',
        grammieNote: 'Brew a teaspoon of fennel seeds in hot water. It relaxes the gut and moves things along.',
        duration: '5 minutes',
        tradition: 'Mediterranean folk medicine',
      },
      {
        id: 'bl-2',
        title: 'Eat slowly and without screens',
        grammieNote: 'The digestive system needs you to be calm to work properly. This is harder than it sounds.',
        duration: '0 minutes',
      },
      {
        id: 'bl-3',
        title: 'Probiotic with breakfast',
        grammieNote: 'A daily probiotic helps balance gut bacteria. Look for one with multiple strains.',
        duration: '1 minute',
        tradition: 'Naturopathic medicine',
      },
    ],
  },
};

export const fallbackRitualTemplate: Omit<Ritual, 'id' | 'profileId' | 'createdAt' | 'hasCommitted' | 'wantsDailyReminder'> = {
  name: 'Daily Wellness Ritual',
  steps: [
    {
      id: 'fw-1',
      title: 'Morning herbal tea',
      grammieNote: 'Start simple. One cup before the day takes over.',
      duration: '5 minutes',
    },
    {
      id: 'fw-2',
      title: '10-minute walk outside',
      grammieNote: 'Not for fitness. For your nervous system.',
      duration: '10 minutes',
    },
    {
      id: 'fw-3',
      title: 'Evening wind-down',
      grammieNote: 'Five minutes of quiet before bed. No agenda.',
      duration: '5 minutes',
    },
  ],
};
