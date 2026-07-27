import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Recommendation, ConfidenceLevel } from "@/types/recommendation";
import { ChatResult } from "@/types/chat";
import PageHeader from "@/components/PageHeader";
import ChatOverlay from "@/components/ChatOverlay";

const CONFIDENCE_STYLES: Record<ConfidenceLevel, { label: string; className: string }> = {
  "research-backed": {
    label: "Research-backed",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  "community-validated": {
    label: "Community-validated",
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
  traditional: {
    label: "Traditional wisdom",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

const RecommendationCard = ({ rec }: { rec: Recommendation }) => {
  const [expanded, setExpanded] = useState(false);
  const badge = CONFIDENCE_STYLES[rec.confidence];

  return (
    <motion.div layout className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-foreground">{rec.title}</p>
            <p className="mt-1 font-body text-sm text-foreground/70 leading-relaxed">{rec.grammieIntro}</p>
          </div>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground mt-0.5 shrink-0"
          >
            ↓
          </motion.span>
        </div>
        <span className={`mt-3 inline-block text-xs font-body font-medium px-2.5 py-1 rounded-full border ${badge.className}`}>
          {badge.label}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-3">
              <p className="font-body text-sm text-foreground/80 leading-relaxed">{rec.expandedDetail}</p>
              {rec.tradition && (
                <p className="font-body text-xs text-muted-foreground">Tradition: {rec.tradition}</p>
              )}
              {rec.communitySignal && (
                <p className="font-body text-xs text-foreground/60 italic">{rec.communitySignal}</p>
              )}
              {rec.researchLinks && rec.researchLinks.length > 0 && (
                <div className="space-y-1">
                  {rec.researchLinks.map((link) => (
                    <a key={link.url} href={link.url} className="block font-body text-xs text-primary underline underline-offset-2">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              {rec.pregnancySafetyNote && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="font-body text-xs text-amber-800">{rec.pregnancySafetyNote}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Symptom = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    setPendingMessage(input.trim());
    setOverlayOpen(true);
  };

  const handleChatComplete = (result: ChatResult) => {
    setOverlayOpen(false);
    if (result.context === "symptom") {
      setRecommendations(result.recommendations);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">
        <PageHeader
          showBack
          showLogo
          onBack={() => recommendations ? setRecommendations(null) : navigate("/dashboard")}
        />

        <AnimatePresence mode="wait">
          {!recommendations && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
                <p className="font-display text-lg italic text-foreground/80 leading-relaxed">
                  "Tell me what's going on. In your own words. Don't worry about getting it right."
                </p>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. I've been waking up at 3am drenched in sweat and can't get back to sleep. I'm exhausted but my mind won't stop…"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card font-body text-sm text-foreground placeholder:text-muted-foreground/60 leading-relaxed resize-none focus:outline-none focus:border-primary/60 transition-colors"
              />

              <button
                disabled={!input.trim()}
                onClick={handleSubmit}
                className={`w-full py-3 rounded-xl font-body font-medium transition-all duration-200 ${
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Find remedies
              </button>
            </motion.div>
          )}

          {recommendations && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {recommendations.length === 0 ? (
                <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
                  <p className="font-display text-lg italic text-foreground/80">
                    "I don't have anything specific for that yet. Come back soon. I'm always learning."
                  </p>
                </div>
              ) : (
                <>
                  <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
                    <p className="font-display text-lg italic text-foreground/80 leading-relaxed">
                      "Here's what I'd suggest. Tap any of these to learn more."
                    </p>
                  </div>
                  {recommendations.map((rec) => (
                    <RecommendationCard key={rec.id} rec={rec} />
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ChatOverlay
        isOpen={overlayOpen}
        context="symptom"
        initialMessage={pendingMessage}
        onClose={() => setOverlayOpen(false)}
        onComplete={handleChatComplete}
      />
    </div>
  );
};

export default Symptom;
