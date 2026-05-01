import openai from "../services/openai.js";
import { searchGoals } from "../services/search.js";
import { goalsContainer, sessionsContainer } from "../services/cosmos.js";

/**
 * GoalBridge Parent Q&A Agent
 * Uses Microsoft Agent Framework pattern:
 * — Receives a parent question
 * — Retrieves relevant goals and session data (RAG)
 * — Generates a plain-language answer via Azure OpenAI
 */
export async function runParentAgent({ question, childId, childName }) {
  // Step 1: Retrieve relevant goals via Azure AI Search (RAG)
  const relevantGoals = await searchGoals(question, childId);

  // Step 2: Fetch recent session notes for context
  const { resources: recentSessions } = await sessionsContainer.items
    .query({
      query: "SELECT TOP 10 * FROM c WHERE c.childId = @childId ORDER BY c.date DESC",
      parameters: [{ name: "@childId", value: childId }],
    })
    .fetchAll();

  // Step 3: Build context string
  const goalsContext = relevantGoals
    .map((g) => `• ${g.title} [${g.domain}] — Status: ${g.status}`)
    .join("\n");

  const sessionsContext = recentSessions
    .map((s) => `• [${s.date}] ${s.therapistName}: ${s.note} (Goal: ${s.goalTitle})`)
    .join("\n");

  // Step 4: Generate answer via Azure OpenAI
  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT,
    messages: [
      {
        role: "system",
        content: `You are a warm, knowledgeable IEP support assistant helping a parent 
understand their child's progress. The child's name is ${childName}. 
Answer clearly and compassionately using only the provided goal and session data. 
If you don't have enough information, say so honestly and suggest who to contact. 
Never use clinical jargon without explaining it.`,
      },
      {
        role: "user",
        content: `Parent question: ${question}

Active IEP Goals:
${goalsContext || "No goals found matching this question."}

Recent Session Notes:
${sessionsContext || "No recent sessions available."}`,
      },
    ],
    max_tokens: 500,
  });

  return {
    answer: response.choices[0].message.content,
    sourcedGoals: relevantGoals.map((g) => g.title),
  };
}

/**
 * Progress Analysis Agent
 * Analyses all goals for a child and flags risks
 */
export async function runProgressAnalysisAgent({ childId }) {
  const { resources: goals } = await goalsContainer.items
    .query({
      query: "SELECT * FROM c WHERE c.childId = @childId",
      parameters: [{ name: "@childId", value: childId }],
    })
    .fetchAll();

  const goalsText = goals
    .map(
      (g) =>
        `Goal: ${g.title} | Domain: ${g.domain} | Status: ${g.status} | Last Updated: ${g.lastUpdated}`
    )
    .join("\n");

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT,
    messages: [
      {
        role: "system",
        content: `You are a special education compliance and progress analyst. 
Analyse the IEP goals provided and identify: 
1. Goals at risk (no updates in 30+ days)
2. Goals making strong progress
3. Recommended actions for the team
Return as structured JSON with keys: atRisk, onTrack, recommendations`,
      },
      {
        role: "user",
        content: `Analyse these IEP goals:\n${goalsText}`,
      },
    ],
    max_tokens: 600,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
