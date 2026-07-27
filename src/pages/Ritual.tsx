import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getRituals, getRitualById, commitToRitual } from "@/services/ritual.service";
import { Ritual, RitualStep } from "@/types/ritual";
import { ChatResult } from "@/types/chat";
import PageHeader from "@/components/PageHeader";
import ChatOverlay from "@/components/ChatOverlay";

type View = "landing" | "list" | "detail" | "explore";

type DetailState =
  | "uncommitted"
  | "commit-prompt"
  | "reminder-prompt"
  | "just-looking"
  | "committed-reminder"
  | "committed-no-reminder";

const GrammieQuote = ({ text }: { text: string }) => (
  <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
    <p className="font-display text-lg italic text-foreground/80 leading-relaxed">"{text}"</p>
  </div>
);

const StepCard = ({ step, checked, onCheck }: { step: RitualStep; checked?: boolean; onCheck?: () => void }) => (
  <div className="flex items-start gap-4 px-5 py-4 rounded-2xl border border-border bg-card">
    {onCheck !== undefined && (
      <button
        onClick={onCheck}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
          checked ? "bg-primary border-primary" : "border-border"
        }`}
      />
    )}
    <div className="flex-1">
      <p className="font-display text-sm font-semibold text-foreground">{step.title}</p>
      <p className="mt-1 font-body text-sm text-foreground/70 leading-relaxed italic">"{step.grammieNote}"</p>
      <div className="mt-2 flex gap-3">
        {step.duration && <span className="font-body text-xs text-muted-foreground">{step.duration}</span>}
        {step.tradition && <span className="font-body text-xs text-muted-foreground">{step.tradition}</span>}
      </div>
    </div>
  </div>
);

// Landing — two primary options
const Landing = ({ onCurrentRituals, onExplore }: { onCurrentRituals: () => void; onExplore: () => void }) => (
  <motion.div
    key="landing"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col gap-4"
  >
    <GrammieQuote text="Your ritual is something you come back to. You can have more than one." />

    <button
      onClick={onCurrentRituals}
      className="flex flex-col justify-between h-40 p-5 rounded-2xl bg-card border border-border text-left hover:border-primary/40 hover:shadow-sm transition-all duration-200"
    >
      <span className="text-3xl">🌿</span>
      <div>
        <p className="font-display text-base font-semibold text-foreground">Your current rituals</p>
        <p className="mt-1 font-body text-xs text-muted-foreground">See and manage what you've built</p>
      </div>
    </button>

    <button
      onClick={onExplore}
      className="flex flex-col justify-between h-40 p-5 rounded-2xl bg-card border border-border text-left hover:border-primary/40 hover:shadow-sm transition-all duration-200"
    >
      <span className="text-3xl">✨</span>
      <div>
        <p className="font-display text-base font-semibold text-foreground">Explore a new ritual</p>
        <p className="mt-1 font-body text-xs text-muted-foreground">Tell me what you need and I'll put something together</p>
      </div>
    </button>
  </motion.div>
);

// Ritual list
const RitualList = ({ rituals, onSelect }: { rituals: Ritual[]; onSelect: (id: string) => void }) => (
  <motion.div
    key="list"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col gap-3"
  >
    {rituals.length === 0 ? (
      <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
        <p className="font-display text-base italic text-foreground/70">
          "You haven't set up any rituals yet. Go explore and I'll put something together."
        </p>
      </div>
    ) : (
      rituals.map((ritual) => (
        <button
          key={ritual.id}
          onClick={() => onSelect(ritual.id)}
          className="flex items-center justify-between px-5 py-4 rounded-2xl border border-border bg-card text-left hover:border-primary/40 hover:shadow-sm transition-all duration-200"
        >
          <div>
            <p className="font-display text-base font-semibold text-foreground">{ritual.name}</p>
            <p className="mt-1 font-body text-xs text-muted-foreground">
              {ritual.steps.length} steps
              {ritual.hasCommitted ? " · Active" : " · Not started"}
            </p>
          </div>
          <span className="text-muted-foreground text-sm">→</span>
        </button>
      ))
    )}
  </motion.div>
);

// Explore new ritual
const ExploreRitual = ({
  rituals,
  onCreated,
  onGoToList,
}: {
  rituals: Ritual[];
  onCreated: (ritual: Ritual) => void;
  onGoToList: () => void;
}) => {
  const [input, setInput] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    setPendingMessage(input.trim());
    setOverlayOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChatComplete = (result: ChatResult) => {
    setOverlayOpen(false);
    if (result.context === "new-ritual") {
      onCreated(result.ritual);
    }
  };

  return (
    <>
      <motion.div
        key="explore"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        {/* Existing rituals reminder */}
        {rituals.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="font-body text-sm text-muted-foreground">You already have these rituals:</p>
            <div className="flex flex-col gap-2">
              {rituals.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card">
                  <span className="font-body text-sm text-foreground">{r.name}</span>
                  <span className="font-body text-xs text-muted-foreground">
                    {r.hasCommitted ? "Active" : "Not started"}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={onGoToList}
              className="w-full py-3 rounded-xl border border-border font-body text-sm text-foreground hover:border-primary/40 transition-colors"
            >
              Adjust an existing ritual
            </button>
          </div>
        )}

        <div className="border-t border-border/40 pt-2" />

        <GrammieQuote text="Something bothering you that isn't covered above? Tell me what's going on." />

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Something to help me wind down at night. My mind won't stop and I can't fall asleep…"
          rows={4}
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
          Build my ritual
        </button>
      </motion.div>

      <ChatOverlay
        isOpen={overlayOpen}
        context="new-ritual"
        initialMessage={pendingMessage}
        onClose={() => setOverlayOpen(false)}
        onComplete={handleChatComplete}
      />
    </>
  );
};

// Ritual detail — full state machine for a single ritual
const RitualDetail = ({ ritual: initialRitual, onBack }: { ritual: Ritual; onBack: () => void }) => {
  const [ritual, setRitual] = useState(initialRitual);
  const [detailState, setDetailState] = useState<DetailState>(
    initialRitual.hasCommitted
      ? (initialRitual.wantsDailyReminder ? "committed-reminder" : "committed-no-reminder")
      : "uncommitted"
  );
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [reminderTime, setReminderTime] = useState(initialRitual.reminderTime ?? "08:00");
  const [selectedBadSteps, setSelectedBadSteps] = useState<Set<string>>(new Set());
  const [modifyOverlayOpen, setModifyOverlayOpen] = useState(false);
  const [modifyPendingMessage, setModifyPendingMessage] = useState("");

  const toggleStep = (id: string) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCommitYes = () => setDetailState("commit-prompt");

  const handleWantsReminder = async () => {
    setDetailState("reminder-prompt");
  };

  const handleConfirmReminder = async () => {
    await commitToRitual(ritual.id, true, reminderTime);
    setDetailState("committed-reminder");
  };

  const handleNoReminder = async () => {
    await commitToRitual(ritual.id, false);
    setDetailState("committed-no-reminder");
  };

  const handleOpenModify = () => {
    setModifyPendingMessage("I want to change some steps in this ritual.");
    setModifyOverlayOpen(true);
  };

  const toggleBadStep = (id: string) => {
    setSelectedBadSteps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleEditSelected = () => {
    const selectedNames = ritual.steps
      .filter(s => selectedBadSteps.has(s.id))
      .map(s => s.title)
      .join(", ");
    setModifyPendingMessage(`These steps aren't working for me: ${selectedNames}`);
    setModifyOverlayOpen(true);
  };

  const handleModifyChatComplete = (result: ChatResult) => {
    setModifyOverlayOpen(false);
    if (result.context === "modify-ritual") {
      setRitual(result.ritual);
      setCheckedSteps(new Set());
      setDetailState(detailState === "committed-reminder" ? "committed-reminder" : "committed-no-reminder");
    }
  };

  return (
    <>
    <AnimatePresence mode="wait">

      {detailState === "uncommitted" && (
        <motion.div key="uncommitted" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-4">
          <GrammieQuote text="This ritual was put together based on what you've told me. It's not a programme. Just what I'd suggest you try for a while and see how your body responds." />
          {ritual.steps.map((step) => <StepCard key={step.id} step={step} />)}
          <div className="pt-2">
            <p className="font-body text-sm text-muted-foreground mb-4 text-center">Are you ready to make this part of your day?</p>
            <div className="flex gap-3">
              <button onClick={() => setDetailState("just-looking")} className="flex-1 py-3 rounded-xl border border-border font-body text-foreground hover:border-primary/40 transition-colors">
                Just looking for now
              </button>
              <button onClick={handleCommitYes} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity">
                Yes, I'll try it
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {detailState === "commit-prompt" && (
        <motion.div key="commit-prompt" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
          <GrammieQuote text="Good. Would you like me to remind you each day? Sometimes a nudge helps, especially at the start." />
          <div className="flex flex-col gap-3">
            <button onClick={handleWantsReminder} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity">
              Yes, remind me
            </button>
            <button onClick={handleNoReminder} className="w-full py-3 rounded-xl border border-border font-body text-foreground hover:border-primary/40 transition-colors">
              No thanks, I'll remember
            </button>
          </div>
        </motion.div>
      )}

      {detailState === "reminder-prompt" && (
        <motion.div key="reminder-prompt" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
          <GrammieQuote text="What time works best for you?" />
          <div className="flex flex-col items-center">
            <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="px-4 py-3 rounded-xl border border-border bg-card font-body text-foreground text-center text-lg focus:outline-none focus:border-primary/60 transition-colors" />
          </div>
          <button onClick={handleConfirmReminder} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity">
            Set reminder
          </button>
        </motion.div>
      )}

      {detailState === "just-looking" && (
        <motion.div key="just-looking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-4">
          {ritual.steps.map((step) => <StepCard key={step.id} step={step} />)}
          <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
            <p className="font-display text-base italic text-foreground/70">"Come back when you're ready. It'll be here."</p>
          </div>
        </motion.div>
      )}

      {detailState === "committed-reminder" && (
        <motion.div key="committed-reminder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-4">
          <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
            <p className="font-display text-base italic text-foreground/70">"I'll check in with you each day at {reminderTime}."</p>
          </div>
          {ritual.steps.map((step) => (
            <StepCard key={step.id} step={step} checked={checkedSteps.has(step.id)} onCheck={() => toggleStep(step.id)} />
          ))}
          <button onClick={handleOpenModify} className="self-center font-body text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors pt-2">
            Edit
          </button>
        </motion.div>
      )}

      {detailState === "committed-no-reminder" && (
        <motion.div key="committed-no-reminder" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-4">
          <div className="px-5 py-4 rounded-2xl bg-secondary/60 border border-border/40">
            <p className="font-display text-base italic text-foreground/70">
              "I'll check in with you every few weeks to see how it's going. If any of these haven't been working, select them and let's change it."
            </p>
          </div>
          {ritual.steps.map((step) => (
            <button
              key={step.id}
              onClick={() => toggleBadStep(step.id)}
              className={`flex items-start gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${
                selectedBadSteps.has(step.id)
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                selectedBadSteps.has(step.id) ? "bg-primary border-primary" : "border-border"
              }`} />
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-foreground">{step.title}</p>
                <p className="mt-1 font-body text-sm text-foreground/70 leading-relaxed italic">"{step.grammieNote}"</p>
                {step.duration && <p className="mt-2 font-body text-xs text-muted-foreground">{step.duration}</p>}
              </div>
            </button>
          ))}
          {selectedBadSteps.size > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleEditSelected}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity"
            >
              Edit
            </motion.button>
          )}
        </motion.div>
      )}

    </AnimatePresence>

    <ChatOverlay
      isOpen={modifyOverlayOpen}
      context="modify-ritual"
      initialMessage={modifyPendingMessage}
      referenceId={ritual.id}
      onClose={() => setModifyOverlayOpen(false)}
      onComplete={handleModifyChatComplete}
    />
    </>
  );
};

// Main page
const Ritual = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("landing");
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [viewTitle, setViewTitle] = useState("Your ritual");

  useEffect(() => {
    getRituals().then(setRituals);
  }, []);

  const handleSelectRitual = async (id: string) => {
    const ritual = await getRitualById(id);
    if (!ritual) return;
    setSelectedRitual(ritual);
    setViewTitle(ritual.name);
    setView("detail");
  };

  const handleExploreCreated = (ritual: Ritual) => {
    setRituals((prev) => [...prev, ritual]);
    setSelectedRitual(ritual);
    setViewTitle(ritual.name);
    setView("detail");
  };

  const refreshRituals = () => getRituals().then(setRituals);

  const getBackAction = () => {
    if (view === "landing") return () => navigate("/dashboard");
    if (view === "list" || view === "explore") return () => setView("landing");
    if (view === "detail") return () => {
      refreshRituals();
      setView("list");
      setSelectedRitual(null);
      setViewTitle("Your ritual");
    };
    return () => navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6">
        <PageHeader showBack showLogo onBack={getBackAction()} />

        <AnimatePresence mode="wait">
          {view === "landing" && (
            <Landing
              key="landing"
              onCurrentRituals={() => setView("list")}
              onExplore={() => setView("explore")}
            />
          )}

          {view === "list" && (
            <RitualList
              key="list"
              rituals={rituals}
              onSelect={handleSelectRitual}
            />
          )}

          {view === "explore" && (
            <ExploreRitual
              key="explore"
              rituals={rituals}
              onCreated={handleExploreCreated}
              onGoToList={() => setView("list")}
            />
          )}

          {view === "detail" && selectedRitual && (
            <RitualDetail
              key={selectedRitual.id}
              ritual={selectedRitual}
              onBack={() => { setView("list"); setSelectedRitual(null); }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Ritual;
