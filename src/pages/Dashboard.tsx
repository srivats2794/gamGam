import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProfile } from "@/services/user.service";
import { getPendingCheckin } from "@/services/checkin.service";
import { UserProfile } from "@/types/user";
import { Checkin } from "@/types/checkin";
import PageHeader from "@/components/PageHeader";

const checkinRemedyLabel: Record<string, string> = {
  "rec-001": "sage tea for your hot flashes",
  "rec-002": "flaxseed for your hot flashes",
  "rec-003": "cooling breathwork for your hot flashes",
  "rec-004": "magnesium glycinate for your sleep",
  "rec-005": "ashwagandha for your sleep",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkin, setCheckin] = useState<Checkin | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
    getPendingCheckin().then(setCheckin);
  }, []);

  if (!profile) return null;

  const grammieGreeting = "Your body has been through a lot. Let's see what might help today.";

  const checkinMessage = checkin?.type === "symptom"
    ? `A few days ago I suggested ${checkinRemedyLabel[checkin.referenceId] ?? "a remedy"}. Did it help at all?`
    : "It's been a few weeks. How is your ritual sitting with you?";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">
        <PageHeader showLogo />

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-display text-2xl text-foreground/85 leading-snug italic">
            "{grammieGreeting}"
          </p>
        </motion.div>

        {/* Check-in card (conditional) */}
        {checkin && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200"
          >
            <p className="font-body text-sm text-amber-900 leading-relaxed mb-3">
              {checkinMessage}
            </p>
            <button
              onClick={() => navigate(`/checkin/${checkin.id}`)}
              className="text-sm font-body font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              Tell me how it went →
            </button>
          </motion.div>
        )}

        {/* Two primary action cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            onClick={() => navigate("/symptom")}
            className="flex flex-col justify-between h-44 p-5 rounded-2xl bg-card border border-border text-left hover:border-primary/40 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-3xl">🌿</span>
            <div>
              <p className="font-display text-base font-semibold text-foreground leading-tight">
                What's bothering you?
              </p>
              <p className="mt-1 font-body text-xs text-muted-foreground">
                Get personalised remedies
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/ritual")}
            className="flex flex-col justify-between h-44 p-5 rounded-2xl bg-card border border-border text-left hover:border-primary/40 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-3xl">🌅</span>
            <div>
              <p className="font-display text-base font-semibold text-foreground leading-tight">
                Your daily ritual
              </p>
              <p className="mt-1 font-body text-xs text-muted-foreground">
                Your practice for today
              </p>
            </div>
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
