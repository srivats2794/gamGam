import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPendingCheckin, completeCheckin } from "@/services/checkin.service";
import { Checkin as CheckinType, CheckinOutcome } from "@/types/checkin";
import PageHeader from "@/components/PageHeader";

const remedyLabel: Record<string, string> = {
  "rec-001": "sage tea for your hot flashes",
  "rec-002": "flaxseed for your hot flashes",
  "rec-003": "cooling breathwork for your hot flashes",
  "rec-004": "magnesium glycinate for your sleep",
  "rec-005": "ashwagandha for your sleep",
};

const symptomFollowUp: Record<CheckinOutcome, string> = {
  helped: "Good. Keep going with it. These things build over time.",
  partially: "That's something. Give it a little longer before deciding. Sometimes the body needs a few weeks.",
  "didnt-help": "That's honest and I appreciate it. Let me look at what else might work for you.",
  skipped: "No pressure. When you're ready, it'll be there.",
};

const GrammieQuote = ({ text }: { text: string }) => (
  <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
    <p className="font-display text-lg italic text-foreground/80 leading-relaxed">"{text}"</p>
  </div>
);

const Checkin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkin, setCheckin] = useState<CheckinType | null>(null);
  const [outcome, setOutcome] = useState<CheckinOutcome | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getPendingCheckin().then(setCheckin);
  }, []);

  const handleOutcome = async (selected: CheckinOutcome) => {
    if (!checkin) return;
    setOutcome(selected);
    await completeCheckin(checkin.id, selected);
    setDone(true);
  };

  const handleRitualResponse = async (response: "well" | "hard" | "change") => {
    if (!checkin) return;
    if (response === "change") {
      navigate("/ritual");
      return;
    }
    const mapped: CheckinOutcome = response === "well" ? "helped" : "partially";
    await completeCheckin(checkin.id, mapped);
    setOutcome(mapped);
    setDone(true);
  };

  if (!checkin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">No check-in found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">

        <PageHeader showBack showLogo onBack={() => navigate("/dashboard")} />

        <AnimatePresence mode="wait">

          {/* Symptom check-in */}
          {!done && checkin.type === "symptom" && (
            <motion.div
              key="symptom-checkin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <GrammieQuote
                text={`A few days ago I suggested ${remedyLabel[checkin.referenceId] ?? "a remedy"}. Did it help at all?`}
              />

              <div className="flex flex-col gap-3">
                {(
                  [
                    { value: "helped", label: "Yes, it helped" },
                    { value: "partially", label: "A little" },
                    { value: "didnt-help", label: "Not really" },
                    { value: "skipped", label: "I didn't try it" },
                  ] as { value: CheckinOutcome; label: string }[]
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOutcome(option.value)}
                    className="w-full py-4 px-5 rounded-xl border border-border bg-card font-body text-left text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ritual check-in */}
          {!done && checkin.type === "ritual" && (
            <motion.div
              key="ritual-checkin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <GrammieQuote text="It's been a few weeks. How is the ritual sitting with you?" />

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleRitualResponse("well")}
                  className="w-full py-4 px-5 rounded-xl border border-border bg-card font-body text-left text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  It's going well
                </button>
                <button
                  onClick={() => handleRitualResponse("hard")}
                  className="w-full py-4 px-5 rounded-xl border border-border bg-card font-body text-left text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  It's been hard to keep up
                </button>
                <button
                  onClick={() => handleRitualResponse("change")}
                  className="w-full py-4 px-5 rounded-xl border border-border bg-card font-body text-left text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  It's not working. I want to change it.
                </button>
              </div>
            </motion.div>
          )}

          {/* Follow-up response */}
          {done && outcome && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <GrammieQuote text={symptomFollowUp[outcome]} />

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity"
              >
                Back to home
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkin;
