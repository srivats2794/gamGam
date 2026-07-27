import { Recommendation } from '../types/recommendation';

export const mockRecommendationsBySymptom: Record<string, Recommendation[]> = {
  'hot-flashes': [
    {
      id: 'rec-001',
      title: 'Sage tea',
      grammieIntro: 'This one has been in kitchens and medicine cabinets for centuries. Sage has a way of cooling things down. Women have known this long before any study confirmed it.',
      expandedDetail: 'Sage contains compounds that interact with oestrogen receptors, which is why it has historically been used to reduce sweating and hot flashes. Brew 1 tsp of dried sage in hot water for 5 minutes. Drink once daily, ideally in the morning.',
      confidence: 'research-backed',
      researchLinks: [{ label: 'Study: Sage for menopausal symptoms', url: '#' }],
      communitySignal: 'Frequently recommended in r/Menopause and r/Perimenopause',
      pregnancySafetyNote: 'Not recommended during pregnancy or breastfeeding.',
      tradition: 'Mediterranean folk medicine',
    },
    {
      id: 'rec-002',
      title: 'Flaxseed (ground)',
      grammieIntro: 'A tablespoon a day in your food. Simple, inexpensive, and the research is there if you want it.',
      expandedDetail: 'Ground flaxseed contains lignans, plant compounds with mild oestrogenic effects that can help reduce hot flash frequency over time. Add 1 to 2 tablespoons to porridge, yoghurt, or a smoothie daily. Results typically seen after 6 to 8 weeks of consistent use.',
      confidence: 'research-backed',
      researchLinks: [{ label: 'Study: Flaxseed and vasomotor symptoms', url: '#' }],
      communitySignal: 'Commonly cited in women\'s health forums as a gentle long-term option',
      tradition: 'Ayurveda',
    },
    {
      id: 'rec-003',
      title: 'Cooling breathwork (4-7-8 method)',
      grammieIntro: 'When a flash hits, your breath is something you always have with you. This technique takes 30 seconds and genuinely interrupts the cycle.',
      expandedDetail: 'Inhale for 4 counts, hold for 7, exhale for 8. Repeat 3–4 times. The extended exhale activates the parasympathetic nervous system, which can interrupt the vascular response behind a hot flash. Practice daily so it becomes instinctive when you need it.',
      confidence: 'community-validated',
      communitySignal: 'Widely recommended in perimenopause communities as an immediate intervention',
      tradition: 'Pranayama (Ayurveda)',
    },
  ],
  'sleep-problems': [
    {
      id: 'rec-004',
      title: 'Magnesium glycinate before bed',
      grammieIntro: '300mg is enough. It takes a few weeks to notice, but most women do.',
      expandedDetail: 'Magnesium glycinate is better absorbed than other forms and supports sleep by calming the nervous system. Take 300mg about 30 minutes before bed. It works gradually. Give it 3 to 4 weeks before judging.',
      confidence: 'research-backed',
      researchLinks: [{ label: 'Study: Magnesium and sleep quality', url: '#' }],
      communitySignal: 'One of the most consistently recommended supplements in r/Menopause',
      tradition: 'Naturopathic medicine',
    },
    {
      id: 'rec-005',
      title: 'Ashwagandha (evening dose)',
      grammieIntro: 'This root has been used for thousands of years to calm an overworked nervous system. The research is catching up to what women have always known.',
      expandedDetail: 'Ashwagandha (Withania somnifera) is an adaptogenic herb that helps regulate cortisol, which when elevated at night, disrupts sleep. Take 300 to 600mg of a root extract in the evening. The research is limited but women report it helps, and that is honest to say.',
      confidence: 'traditional',
      communitySignal: 'Regularly mentioned in perimenopause forums as helpful for wired-but-tired feelings',
      tradition: 'Ayurveda',
    },
  ],
};
