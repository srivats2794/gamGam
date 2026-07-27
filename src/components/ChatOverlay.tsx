import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext, ChatMessage, ChatResult } from "@/types/chat";
import { sendMessage } from "@/services/chat.service";

interface ChatOverlayProps {
  isOpen: boolean;
  context: ChatContext;
  initialMessage: string;
  referenceId?: string;
  onClose: () => void;
  onComplete: (result: ChatResult) => void;
}

const TypingIndicator = () => (
  <div className="flex items-end gap-2 mb-4">
    <div className="flex gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-secondary/80 border border-border/30">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-foreground/40"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isGrammie = message.role === "grammie";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isGrammie ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isGrammie
            ? "bg-secondary/80 border border-border/30 rounded-tl-sm font-display italic text-foreground/85"
            : "bg-primary/15 rounded-tr-sm font-body text-foreground"
        }`}
      >
        {isGrammie ? `"${message.text}"` : message.text}
      </div>
    </motion.div>
  );
};

const ChatOverlay = ({
  isOpen,
  context,
  initialMessage,
  referenceId,
  onClose,
  onComplete,
}: ChatOverlayProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [result, setResult] = useState<ChatResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && initialMessage) {
      // Reset state on open
      const firstMessage: ChatMessage = { role: "user", text: initialMessage };
      setMessages([firstMessage]);
      setInput("");
      setTyping(false);
      setResolved(false);
      setResult(null);
      // Get Grammie's first response
      getGrammieResponse([firstMessage]);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  const getGrammieResponse = async (currentMessages: ChatMessage[]) => {
    setTyping(true);
    // Simulate a short thinking delay
    await new Promise(r => setTimeout(r, 900));
    const response = await sendMessage(context, currentMessages, referenceId);
    setTyping(false);

    const grammieMsg: ChatMessage = { role: "grammie", text: response.reply };
    setMessages(prev => [...prev, grammieMsg]);

    if (response.resolved && response.result) {
      setResolved(true);
      setResult(response.result);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || typing || resolved) return;
    const userMsg: ChatMessage = { role: "user", text: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    await getGrammieResponse(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleComplete = () => {
    if (result) onComplete(result);
  };

  const ctaLabel: Record<ChatContext, string> = {
    "symptom": "See your remedies",
    "new-ritual": "See your ritual",
    "modify-ritual": "See your updated ritual",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/30 z-40"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl flex flex-col"
            style={{ height: "82vh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
              <p className="font-display text-sm font-semibold text-primary">mygrammie</p>
              <button
                onClick={onClose}
                className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* CTA when resolved */}
            <AnimatePresence>
              {resolved && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-5 pb-3 shrink-0"
                >
                  <button
                    onClick={handleComplete}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity"
                  >
                    {ctaLabel[context]}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            {!resolved && (
              <div className="px-5 pb-6 pt-2 border-t border-border/40 flex gap-3 items-end shrink-0">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={typing}
                  placeholder="Type your reply…"
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-card font-body text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/60 transition-colors disabled:opacity-50"
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || typing}
                  className={`shrink-0 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                    input.trim() && !typing
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatOverlay;
