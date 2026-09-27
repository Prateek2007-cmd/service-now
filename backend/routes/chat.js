// Chat and Conversational Engine Routes for HERE Platform
import express from 'express';
import { evaluateSafety } from '../services/safety/safetyService.js';
import { classifySupportCase } from '../services/ml/mlClient.js';
import { processConversation, getConversationState, saveConversationState } from '../../src/services/conversationEngine.js';

const router = express.Router();

// POST /api/chat
router.post('/', async (req, res) => {
  const { conversationId, message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    // 1. Safety Check Layer (Section 11)
    const safetyCheck = evaluateSafety(message);
    if (safetyCheck.isCrisis) {
      return res.json({
        reply: safetyCheck.reply,
        stage: 'SAFETY',
        intent: 'CRISIS_SUPPORT',
        themes: [{ label: 'Immediate Crisis Support', relevance: 'Urgent', color: '#F87171' }],
        urgency: 'RED',
        safetyAlert: safetyCheck.safetyAlert,
        nextAction: 'SHOW_SAFETY_CRISIS',
        progress: 'Immediate Care Triage'
      });
    }

    // 2. Load Conversation State
    let state = getConversationState();
    if (!state || (conversationId && state.conversationId !== conversationId)) {
      state.conversationId = conversationId || `CONV-${Date.now()}`;
    }

    // Record user message
    state.messages.push({
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // 3. Process turn through Conversation Engine for structured state
    const result = await processConversation(message, state);

    // 4. Enrich with Upstream Gemini Generative AI if available
    let finalReply = result.reply;
    let engineMode = 'RULE_ENGINE';

    if (!safetyCheck.isCrisis && result.stage !== 'SAFETY' && result.stage !== 'SCHEDULE' && result.stage !== 'RECOMMEND') {
      try {
        const { generateResponse } = await import('../services/llm/provider.js');
        const { CONVERSATIONAL_SYSTEM_PROMPT } = await import('../services/llm/prompts.js');

        const promptInstruction = `${CONVERSATIONAL_SYSTEM_PROMPT}

Current conversational phase: ${result.stage}
Context/Theme inferred: ${result.intent || 'General wellbeing'}
Current known facts: ${JSON.stringify(result.knownInformation || {})}

Instructions for your response:
1. Acknowledge what the student specifically shared with genuine warmth and empathy.
2. If the student is feeling pressure/overwhelm, gently ask what is weighing on them most (e.g., specific exams, workload, concentration, or personal matters).
3. If they shared about sleep or daily routines, acknowledge that fatigue and explore the duration.
4. If in CONFIRM stage, reflect the summary gently: "Here's what I'm understanding so far... Did I get that right?".
5. Keep your response concise (2-3 sentences), warm, and supportive.
6. NEVER diagnose any condition. NEVER jump prematurely to booking or services.`;

        // Pass conversation history
        const historyForLLM = (state.messages || []).map(m => ({
          sender: m.sender,
          text: m.text
        }));

        const llmResult = await generateResponse({
          messages: historyForLLM,
          systemPrompt: promptInstruction
        });

        if (llmResult && llmResult.success && llmResult.text) {
          finalReply = llmResult.text.trim();
          engineMode = 'GEMINI_GENERATIVE_AI';
        }
      } catch (llmErr) {
        console.warn('[BACKEND CHAT] Gemini LLM generation fallback:', llmErr.message);
      }
    }

    // 5. Run ML Classification in background / sidecar
    const mlAnalysis = await classifySupportCase(message);

    // Merge and save state
    state.stage = result.stage;
    state.currentStage = result.stage;
    state.intent = result.intent || mlAnalysis.primaryIntent;
    state.detectedIntent = state.intent;
    state.themes = result.themes || state.themes;
    state.detectedThemes = state.themes;
    state.urgency = result.urgency || mlAnalysis.urgencyLevel;
    state.engineMode = engineMode;

    if (result.aiMirrorPoints) state.aiMirrorPoints = result.aiMirrorPoints;
    if (result.provisionalSummary) state.provisionalSummary = result.provisionalSummary;
    if (result.recommendedServices) state.recommendedServices = result.recommendedServices;

    // Record assistant message
    state.messages.push({
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: finalReply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stage: result.stage,
      options: result.options,
      nextAction: result.nextAction
    });

    saveConversationState(state);

    return res.json({
      reply: finalReply,
      stage: result.stage,
      intent: state.intent,
      themes: state.themes,
      urgency: state.urgency,
      options: result.options,
      nextAction: result.nextAction,
      progress: result.progress,
      aiMirrorPoints: state.aiMirrorPoints,
      provisionalSummary: state.provisionalSummary,
      recommendedServices: state.recommendedServices,
      engineMode,
      mlClassification: mlAnalysis
    });
  } catch (err) {
    console.error('[API CHAT ERROR]', err);
    res.status(500).json({ error: 'Chat processing failed', details: err.message });
  }
});

export default router;
