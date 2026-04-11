# mygrammie — Phase 1 PRD (Prototype)

**Version:** 1.0  
**Scope:** Visual prototype only. All data is mocked. No backend, no auth, no real AI.  
**Goal:** Make the full app flow navigable and reviewable so UX can be validated before Phase 2 development begins.

---

## Architecture principle: mock/real data layer separation

All data must flow through a single service layer so that replacing mock data with real API calls in Phase 2 requires no component rewrites.

### Structure

```
src/
  services/
    user.service.ts          # Profile, life stage, symptoms
    recommendations.service.ts
    ritual.service.ts
    checkin.service.ts
    notifications.service.ts
  mock/
    user.mock.ts
    recommendations.mock.ts
    ritual.mock.ts
    checkin.mock.ts
    notifications.mock.ts
```

### Pattern

Each service file exports async functions. In Phase 1 these functions return mock data. In Phase 2 the function body is swapped for a real API call — the signature and return shape stay identical.

```ts
// services/recommendations.service.ts
import { getMockRecommendations } from '../mock/recommendations.mock';

export async function getRecommendations(symptom: string, profileId: string) {
  // Phase 2: replace this line with real API call
  return getMockRecommendations(symptom, profileId);
}
```

Components never import from `mock/` directly. They only call service functions.

---

## Core data types

Define these types in `src/types/` and use them throughout. Mock data must conform to these shapes exactly so Phase 2 is a drop-in.

```ts
// types/user.ts
export type LifeStage = 'teen' | 'premenopausal' | 'perimenopausal' | 'postmenopausal';

export interface UserProfile {
  id: string;
  name: string;
  lifeStage: LifeStage;
  symptoms: string[];
  sensitivities: string[];
  goals: string[];
  hasCommittedToRitual: boolean;
  wantsDailyReminder: boolean;
  reminderTime?: string; // e.g. "08:00"
}

// types/recommendation.ts
export type ConfidenceLevel = 'research-backed' | 'community-validated' | 'traditional';

export interface Recommendation {
  id: string;
  title: string;
  grammieIntro: string;       // Short Grammie-voice summary shown on card
  expandedDetail: string;     // Full explanation shown on expanded view
  confidence: ConfidenceLevel;
  researchLinks?: { label: string; url: string }[];
  communitySignal?: string;   // e.g. "Used widely in r/Menopause"
  pregnancySafetyNote?: string; // Only present if relevant
  tradition?: string;         // e.g. "Ayurveda", "TCM"
}

// types/ritual.ts
export interface RitualStep {
  id: string;
  title: string;
  grammieNote: string;
  duration?: string;          // e.g. "5 minutes"
  tradition?: string;
}

export interface Ritual {
  id: string;
  profileId: string;
  steps: RitualStep[];
  createdAt: string;
  isActive: boolean;
}

// types/checkin.ts
export type CheckinType = 'symptom' | 'ritual';
export type CheckinOutcome = 'helped' | 'partially' | 'didnt-help' | 'skipped';

export interface Checkin {
  id: string;
  type: CheckinType;
  referenceId: string;        // recommendation ID or ritual ID
  dueAt: string;
  completedAt?: string;
  outcome?: CheckinOutcome;
  notes?: string;
}

// types/notification.ts
export type NotificationType = 'symptom-checkin' | 'ritual-checkin' | 'daily-reminder' | 'lapsed';

export interface AppNotification {
  id: string;
  type: NotificationType;
  grammieMessage: string;
  deepLinkTo: string;         // route to navigate on tap
  scheduledFor: string;
  seen: boolean;
}
```

---

## Screens and flows

### 1. Loading screen

**Route:** `/` (app entry point)  
**Purpose:** First impression. Sets tone before any content.

**Behaviour:**
- Shows a sequence of 3 grandmother avatar illustrations fading in and out, each from a visually distinct cultural background (e.g. South Asian, West African, East Asian)
- Avatars are SVG or PNG illustrations — editorial style, warm but not cartoonish, white/silver hair, aged features
- Transition: crossfade between avatars using Framer Motion, ~1.5s per avatar
- After the sequence (or after ~4s total), automatically navigates to:
  - `/onboarding` if no user profile exists in state
  - `/dashboard` if profile already exists

**Mock data:** A `hasCompletedOnboarding` boolean in mock user state, defaulting to `false`.

**UI notes:**
- Full screen, warm cream or soft sage background
- App name "mygrammie" centred below the avatar in a warm serif font
- No skip button in prototype

---

### 2. Onboarding / profile setup

**Route:** `/onboarding`  
**Purpose:** Collect the user's profile so Grammie can personalise recommendations and ritual.  
**Shown:** New users only. Skip entirely if profile already exists.

**Flow:** Multi-step form. Each step is a single screen. Progress indicator at top (e.g. step 1 of 4).

**Grammie's voice** introduces each step. She speaks in first person, warm and direct. Examples below — use these as the mock copy.

#### Step 1 — Life stage
Grammie says: *"Before we begin — where are you in your journey right now?"*  
Options (single select):
- Teen / early adulthood
- Premenopausal (regular cycles, under 40)
- Perimenopausal (cycles changing, 40s–50s)
- Postmenopausal

#### Step 2 — Current symptoms
Grammie says: *"What's been weighing on you lately? Pick everything that applies."*  
Options (multi-select checkboxes):
- Hot flashes
- Sleep problems
- Mood swings / irritability
- Joint pain
- Brain fog
- Fatigue
- Irregular cycles
- Anxiety
- Low libido
- Bloating / digestive issues

#### Step 3 — Sensitivities and preferences
Grammie says: *"Good to know. Now — anything I should keep in mind when I'm suggesting remedies?"*  
Options (multi-select):
- Pregnant or trying to conceive
- Breastfeeding
- Vegetarian / vegan
- Prefer no alcohol-based remedies
- Prefer no caffeine-based remedies
- Nut allergy
- No preference

#### Step 4 — Goals
Grammie says: *"Last one. What matters most to you right now?"*  
Options (multi-select):
- Feel more like myself
- Sleep better
- Manage hot flashes
- Reduce stress and anxiety
- Move and feel better physically
- Understand what's happening to my body
- Build a consistent daily practice

**On completion:** Navigate to `/dashboard`. Save profile to user service.

**UI notes:**
- Back button on each step (except step 1)
- CTA button label: "Continue" (steps 1–3), "Let's go" (step 4)
- Grammie's message appears at the top of each step as a soft card or quote block — her "presence" without showing an avatar

---

### 3. Home / dashboard

**Route:** `/dashboard`  
**Purpose:** Central hub. Two primary paths visible immediately.

**Layout:**

1. **Greeting** — Grammie's voice, personalised to profile. Example mock copy:  
   *"Good morning. Your body has been through a lot this week — let's see what might help."*

2. **Two primary action cards** (equal visual weight, side by side on tablet, stacked on mobile):
   - **"What's bothering you?"** — navigates to `/symptom`
   - **"Your daily ritual"** — navigates to `/ritual`

3. **Check-in card** (conditional — only shown when a check-in is due):
   - Appears as a soft banner above or between the two primary cards
   - Grammie's voice. Example: *"A few days ago I suggested sage tea for your hot flashes. How did that land?"*
   - CTA: "Tell me how it went" → navigates to `/checkin/:id`

4. **Recent recommendations** (optional, shown if user has prior history):
   - Small horizontal scroll row of past recommendation cards

**Mock data:** Hardcode a check-in card as visible in the prototype so the UI state is testable.

**UI notes:**
- Warm, uncluttered. Lots of white space.
- Grammie's greeting is not signed with her name — her voice is the presence, not a label
- No notification bell or badge UI needed in Phase 1

---

### 4. Symptom input

**Route:** `/symptom`  
**Purpose:** User tells Grammie what's wrong. Grammie responds with recommendations.

**Flow:**

**Step 1 — Symptom selection**  
Grammie says: *"Tell me what's going on. I'll find you something that's helped other women — and has some history behind it."*

Display a grid of symptom chips (same list as onboarding step 2 plus "Something else"). User selects one symptom. Single select only — one symptom per session.

CTA: "Find remedies" → goes to Step 2.

**Step 2 — Recommendations**  
Shows 3–5 recommendation cards in Grammie's voice.

Each card shows:
- Remedy name (e.g. "Sage tea")
- Grammie's intro line (1–2 sentences, first person)
- Confidence badge: one of `Research-backed`, `Community-validated`, or `Traditional wisdom`
- Tap to expand

Expanded state shows:
- Full explanation in Grammie's voice
- Research links if present (mock with placeholder URLs)
- Community signal if present (e.g. "Widely used in r/Menopause")
- Tradition if present (e.g. "Mediterranean folk medicine")
- Pregnancy safety note if applicable (shown as a soft warning, not alarming)

**Mock recommendations (use these exactly):**

```ts
// For symptom: "Hot flashes"
[
  {
    id: "rec-001",
    title: "Sage tea",
    grammieIntro: "This one has been in kitchens and medicine cabinets for centuries. Sage has a way of cooling things down — women have known this long before any study confirmed it.",
    expandedDetail: "Sage contains compounds that interact with oestrogen receptors, which is why it has historically been used to reduce sweating and hot flashes. Brew 1 tsp of dried sage in hot water for 5 minutes. Drink once daily, ideally in the morning.",
    confidence: "research-backed",
    researchLinks: [{ label: "Study: Sage for menopausal symptoms", url: "#" }],
    communitySignal: "Frequently recommended in r/Menopause and r/Perimenopause",
    pregnancySafetyNote: "Not recommended during pregnancy or breastfeeding.",
    tradition: "Mediterranean folk medicine"
  },
  {
    id: "rec-002",
    title: "Flaxseed (ground)",
    grammieIntro: "A tablespoon a day in your food. Simple, inexpensive, and the research is there if you want it.",
    expandedDetail: "Ground flaxseed contains lignans — plant compounds with mild oestrogenic effects that can help reduce hot flash frequency over time. Add 1–2 tablespoons to porridge, yoghurt, or a smoothie daily. Results typically seen after 6–8 weeks of consistent use.",
    confidence: "research-backed",
    researchLinks: [{ label: "Study: Flaxseed and vasomotor symptoms", url: "#" }],
    communitySignal: "Commonly cited in women's health forums as a gentle long-term option",
    tradition: "Ayurveda"
  },
  {
    id: "rec-003",
    title: "Cooling breathwork (4-7-8 method)",
    grammieIntro: "When a flash hits, your breath is something you always have with you. This technique takes 30 seconds and genuinely interrupts the cycle.",
    expandedDetail: "Inhale for 4 counts, hold for 7, exhale for 8. Repeat 3–4 times. The extended exhale activates the parasympathetic nervous system, which can interrupt the vascular response behind a hot flash. Practice daily so it becomes instinctive when you need it.",
    confidence: "community-validated",
    communitySignal: "Widely recommended in perimenopause communities as an immediate intervention",
    tradition: "Pranayama (Ayurveda)"
  }
]
```

Add 2 more mock recommendations for at least one other symptom (e.g. "Sleep problems") using the same shape.

**UI notes:**
- Recommendation cards use soft expansion (Framer Motion) — not a new page
- Confidence badge uses distinct but subtle colour treatment per level
- Pregnancy safety note shown in amber/warm yellow — not red (not alarming, just informational)

---

### 5. Daily ritual

**Route:** `/ritual`  
**Purpose:** Show the user their personalised daily ritual and manage commitment + notifications.

**Flow:**

**State A — First visit (no commitment yet)**

Grammie says: *"This is your ritual — put together from what you've told me and what's worked for women at your stage. It's not a programme. It's just what I'd suggest you do each day, for a while, and see how your body responds."*

Show the ritual step list (3–5 steps, see mock data below).

Below the list, a commitment prompt:  
*"Are you ready to make this part of your day?"*  
Two buttons: **"Yes, I'll try it"** → State B | **"Just looking for now"** → State C

**State B — Committed, notification consent**

Grammie says: *"Good. Would you like me to remind you each day? Sometimes a nudge helps, especially at the start."*

Two options:
- **"Yes, remind me"** — shows a time picker (default 08:00), then saves preference → State D (committed + reminders on)
- **"No thanks, I'll remember"** → State E (committed, no reminders)

**State C — Not committed**

Ritual steps remain visible. A soft note at the bottom:  
*"Come back when you're ready. It'll be here."*  
No tracking, no notifications.

**State D — Committed with daily reminder**

Shows ritual step list with a progress indicator (e.g. checkboxes per step for today).  
A small note: *"I'll check in with you each [day at 08:00]."*  
No ritual check-in notifications will be sent (reminder replaces it).

**State E — Committed, no daily reminder**

Shows ritual step list with progress indicator.  
A small note: *"I'll check in with you every few weeks to see how it's going."*  
Ritual check-in notifications will be sent every 2–4 weeks.

**Modify ritual — available in all committed states**

A low-prominence link/button: "This isn't working for me — let's change it"  
On tap: shows a brief prompt from Grammie (*"Tell me what's not working and I'll put something new together."*) + a free-text field + "Update my ritual" button.  
In Phase 1: tapping "Update my ritual" simply regenerates from mock data and returns to State D or E (whichever applied). Notification consent is carried over silently.

**Mock ritual steps (use these):**

```ts
[
  {
    id: "step-001",
    title: "Morning sage tea",
    grammieNote: "First thing, before anything else. Let it steep for at least 5 minutes.",
    duration: "5 minutes",
    tradition: "Mediterranean folk medicine"
  },
  {
    id: "step-002",
    title: "Flaxseed with breakfast",
    grammieNote: "A tablespoon ground, stirred into whatever you're eating. You won't taste it.",
    duration: "1 minute",
    tradition: "Ayurveda"
  },
  {
    id: "step-003",
    title: "10-minute walk outside",
    grammieNote: "Not for fitness. For your nervous system. Morning light is better if you can manage it.",
    duration: "10 minutes"
  },
  {
    id: "step-004",
    title: "Magnesium glycinate before bed",
    grammieNote: "300mg is enough. It takes a few weeks to notice — but most women do.",
    duration: "1 minute",
    tradition: "Naturopathic medicine"
  }
]
```

---

### 6. Check-in

**Route:** `/checkin/:id`  
**Purpose:** Close the feedback loop on a recommendation or ritual.

**Two variants** based on `checkin.type`:

**Symptom check-in**  
Grammie says (example): *"A few days ago I suggested sage tea for your hot flashes. I've been wondering — did it help at all?"*

Four response options (large tap targets):
- "Yes, it helped"
- "A little"
- "Not really"
- "I didn't try it"

On selection: Grammie responds with a brief follow-up message and returns to dashboard.  
Example follow-up (if "Yes, it helped"): *"Good. Keep going with it — these things build over time."*  
Example follow-up (if "Not really"): *"That's honest and I appreciate it. Let me look at what else might work for you."*

**Ritual check-in**  
Grammie says: *"It's been a few weeks. How is the ritual sitting with you?"*

Three response options:
- "It's going well"
- "It's been hard to keep up"
- "It's not working — I want to change it"

Third option navigates to the modify ritual flow.

**Mock data:** Pre-populate one symptom check-in and one ritual check-in as available, both accessible from the dashboard check-in card.

---

### 7. Notification mock (visual only)

**No real push notifications in Phase 1.** The notification system is simulated in-app only.

Implement a `useNotifications()` hook that:
- Reads from `notifications.service.ts` (backed by mock data)
- Returns a list of `AppNotification` objects
- The dashboard check-in card is driven by this hook

Mock notification state should include at least:
- One `symptom-checkin` notification (due, unseen)
- One `daily-reminder` notification (scheduled, unseen)

This means in Phase 2 the hook body is replaced with real push notification registration and scheduling — nothing in the dashboard or check-in components changes.

---

## Navigation structure

```
/                          → Loading screen
/onboarding                → Multi-step profile setup
/dashboard                 → Home
/symptom                   → Symptom input + recommendations
/ritual                    → Daily ritual (all states)
/checkin/:id               → Check-in flow
```

Use React Router. All routes accessible without auth in Phase 1.

---

## Grammie's voice — rules for all mock copy

These rules apply to every string written in Grammie's voice. Phase 2 AI-generated copy must also conform to these rules.

- First person always ("I'd suggest", "I've seen this help", "I've been wondering")
- Short sentences. She does not over-explain.
- No em dashes
- No exclamation marks
- No clinical language (not "vasomotor symptoms" — "hot flashes")
- She validates before she advises ("Your body is doing a lot right now" before suggesting a remedy)
- She speaks as a community insider ("women have known this", "I've seen this help a lot of women") not as an authority
- She acknowledges uncertainty honestly ("the research is limited, but I've seen this help", "I can't promise it works for everyone")
- She never oversells

---

## Visual design direction

**Colour palette (suggest, not prescribe):**
- Background: warm cream (`#FAF6F0`) or soft sage (`#EFF4EE`)
- Primary text: deep warm brown (`#2C1A0E`)
- Accent: muted terracotta or warm amber for CTAs
- Confidence badges: soft tones only — no harsh reds or greens

**Typography:**
- Grammie's voice lines: serif, slightly larger, warm
- UI labels and body: clean sans-serif
- No bold overuse — restraint signals credibility

**Illustration style (for avatar placeholders):**
- Editorial, not cartoonish
- Aged features, silver/white hair
- Ethnically ambiguous — multicultural without being pinned to one heritage
- Use placeholder SVGs or solid-colour placeholder cards in Phase 1 if final illustrations are not ready

**Animation:**
- Loading screen avatar crossfade: Framer Motion `AnimatePresence`
- Recommendation card expansion: smooth height animation, not a page push
- Screen transitions: gentle fade or slide, nothing bouncy

---

## What Phase 1 does NOT include

- Authentication or user accounts
- Any real AI or API calls
- Real push notifications
- Backend or database
- Community forum
- Expert collaboration features
- Monetisation or paywalls

---

## Definition of done for Phase 1

- [ ] All 6 routes render without errors
- [ ] Loading screen plays avatar sequence and auto-navigates
- [ ] Onboarding completes and saves mock profile to service layer
- [ ] Dashboard shows greeting, two path cards, and conditional check-in card
- [ ] Symptom flow shows recommendations with expand/collapse
- [ ] Ritual shows all states (uncommitted / committed+reminder / committed+no reminder)
- [ ] Modify ritual flow is navigable
- [ ] Check-in flow for both types is completable
- [ ] All data flows through service layer (zero direct mock imports in components)
- [ ] No TypeScript errors
- [ ] Passes existing Vitest unit tests
- [ ] Navigable end-to-end in Playwright E2E test

---

*Phase 2 PRD (core functionality, real data layer, AI integration) to follow once Phase 1 prototype is reviewed and approved.*
