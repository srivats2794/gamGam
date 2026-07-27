import { ChatContext, ChatMessage, ChatResponse } from '../types/chat';
import { getRecommendations } from './recommendations.service';
import { addRitual, regenerateRitual } from './ritual.service';

// Phase 2: replace entire function body with a streaming LLM API call.
// Signature stays identical — context, full message history, optional referenceId.
export async function sendMessage(
  context: ChatContext,
  messages: ChatMessage[],
  referenceId?: string,
): Promise<ChatResponse> {
  const userMessages = messages.filter(m => m.role === 'user');
  const firstUserMessage = userMessages[0]?.text ?? '';

  // One follow-up question per context before resolving
  if (userMessages.length === 1) {
    const followUp = FOLLOW_UPS[context];
    if (followUp) return { reply: followUp, resolved: false };
  }

  // Resolve after follow-up answered (or immediately if no follow-up)
  if (context === 'symptom') {
    const lower = firstUserMessage.toLowerCase();
    const symptomKey =
      lower.includes('sleep') || lower.includes('insomnia') || lower.includes('awake') || lower.includes('tired')
        ? 'sleep-problems'
        : 'hot-flashes';
    const recommendations = await getRecommendations(symptomKey);
    return {
      reply: "I have some things that might help. Take a look.",
      resolved: true,
      result: { context: 'symptom', recommendations },
    };
  }

  if (context === 'new-ritual') {
    const ritual = await addRitual(firstUserMessage);
    return {
      reply: "I've put something together for you. See if it feels right.",
      resolved: true,
      result: { context: 'new-ritual', ritual },
    };
  }

  if (context === 'modify-ritual' && referenceId) {
    const ritual = await regenerateRitual(referenceId, firstUserMessage);
    return {
      reply: "I've reworked it. See if this sits better.",
      resolved: true,
      result: { context: 'modify-ritual', ritual },
    };
  }

  return { reply: "Let me think on that.", resolved: false };
}

const FOLLOW_UPS: Record<ChatContext, string> = {
  'symptom': "How long have you been experiencing this? And does anything tend to make it worse?",
  'new-ritual': "How much time can you realistically set aside each day? Even 10 minutes counts.",
  'modify-ritual': "Why do you think these aren't working for you? The more you can tell me, the better I can adjust it.",
};
