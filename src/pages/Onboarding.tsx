import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { saveProfile } from "@/services/user.service";
import { generateRitualsForProfile } from "@/services/ritual.service";
import { UserProfile, LifeStage } from "@/types/user";

const LIFE_STAGES: { value: LifeStage; label: string }[] = [
  { value: "teen", label: "Teen / early adulthood" },
  { value: "premenopausal", label: "Premenopausal (regular cycles, under 40)" },
  { value: "perimenopausal", label: "Perimenopausal (cycles changing, 40s–50s)" },
  { value: "postmenopausal", label: "Postmenopausal" },
];

const SYMPTOMS = [
  { value: "hot-flashes", label: "Hot flashes" },
  { value: "sleep-problems", label: "Sleep problems" },
  { value: "mood-swings", label: "Mood swings / irritability" },
  { value: "joint-pain", label: "Joint pain" },
  { value: "brain-fog", label: "Brain fog" },
  { value: "fatigue", label: "Fatigue" },
  { value: "irregular-cycles", label: "Irregular cycles" },
  { value: "anxiety", label: "Anxiety" },
  { value: "low-libido", label: "Low libido" },
  { value: "bloating", label: "Bloating / digestive issues" },
];

const SENSITIVITIES = [
  { value: "pregnant", label: "Pregnant or trying to conceive" },
  { value: "breastfeeding", label: "Breastfeeding" },
  { value: "vegetarian", label: "Vegetarian / vegan" },
  { value: "no-alcohol", label: "Prefer no alcohol-based remedies" },
  { value: "no-caffeine", label: "Prefer no caffeine-based remedies" },
  { value: "nut-allergy", label: "Nut allergy" },
  { value: "none", label: "No preference" },
];

const GOALS = [
  { value: "feel-more-like-myself", label: "Feel more like myself" },
  { value: "sleep-better", label: "Sleep better" },
  { value: "manage-hot-flashes", label: "Manage hot flashes" },
  { value: "reduce-stress", label: "Reduce stress and anxiety" },
  { value: "move-better", label: "Move and feel better physically" },
  { value: "understand-body", label: "Understand what's happening to my body" },
  { value: "daily-practice", label: "Build a consistent daily practice" },
];

const GrammieQuote = ({ text }: { text: string }) => (
  <div className="mb-8 px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
    <p className="font-display text-lg italic text-foreground/80 leading-relaxed">
      "{text}"
    </p>
  </div>
);

const ProgressBar = ({ step, total }: { step: number; total: number }) => (
  <div className="mb-8">
    <div className="flex justify-between mb-2">
      <span className="text-xs text-muted-foreground font-body">Step {step} of {total}</span>
    </div>
    <div className="h-1 bg-border rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(step / total) * 100}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  </div>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [sensitivities, setSensitivities] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  const toggleMulti = (value: string, current: string[], setter: (v: string[]) => void) => {
    setter(current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  };

  const handleComplete = async () => {
    const profile: UserProfile = {
      id: "user-001",
      name: "Sarah",
      lifeStage: lifeStage!,
      symptoms,
      sensitivities,
      goals,
      hasCommittedToRitual: false,
      wantsDailyReminder: false,
    };
    await saveProfile(profile);
    await generateRitualsForProfile(profile);
    navigate("/dashboard");
  };

  const canContinue = () => {
    if (step === 1) return lifeStage !== null;
    if (step === 2) return symptoms.length > 0;
    if (step === 3) return sensitivities.length > 0;
    if (step === 4) return goals.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-6 py-10">
        <ProgressBar step={step} total={4} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <GrammieQuote text="Before we begin. Where are you in your journey right now?" />
              <div className="space-y-3">
                {LIFE_STAGES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setLifeStage(s.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border font-body transition-all duration-200 ${
                      lifeStage === s.value
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <GrammieQuote text="What's been weighing on you lately? Pick everything that applies." />
              <div className="grid grid-cols-2 gap-3">
                {SYMPTOMS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => toggleMulti(s.value, symptoms, setSymptoms)}
                    className={`text-left px-4 py-3 rounded-xl border font-body text-sm transition-all duration-200 ${
                      symptoms.includes(s.value)
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <GrammieQuote text="Good to know. Anything I should keep in mind when I'm suggesting remedies?" />
              <div className="space-y-3">
                {SENSITIVITIES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => toggleMulti(s.value, sensitivities, setSensitivities)}
                    className={`w-full text-left px-5 py-4 rounded-xl border font-body transition-all duration-200 ${
                      sensitivities.includes(s.value)
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <GrammieQuote text="Last one. What matters most to you right now?" />
              <div className="space-y-3">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => toggleMulti(g.value, goals, setGoals)}
                    className={`w-full text-left px-5 py-4 rounded-xl border font-body transition-all duration-200 ${
                      goals.includes(g.value)
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="sticky bottom-0 bg-background border-t border-border/40 px-6 py-4 flex gap-3 max-w-lg mx-auto w-full">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-3 rounded-xl border border-border font-body text-foreground hover:border-primary/40 transition-colors"
          >
            Back
          </button>
        )}
        <button
          disabled={!canContinue()}
          onClick={() => step < 4 ? setStep(step + 1) : handleComplete()}
          className={`flex-1 py-3 rounded-xl font-body font-medium transition-all duration-200 ${
            canContinue()
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {step < 4 ? "Continue" : "Let's go"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
