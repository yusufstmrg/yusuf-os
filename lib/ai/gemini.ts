import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export interface ChiefOfStaffMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

export interface QuickCaptureTriage {
  category: "task" | "goal" | "idea" | "wealth" | "evidence" | "note";
  title: string;
  summary: string;
  suggestedPriority: "high" | "medium" | "low";
  nextAction: string;
  tags: string[];
}

const CHIEF_OF_STAFF_SYSTEM_PROMPT = `
You are the AI Chief of Staff for Yusuf OS (personal operating system of Yusuf B. Situmorang).
Your guiding philosophy:
- "One Platform. One Source of Truth. Private Intelligence + Public Proof."
- "Build. Serve. Grow. Give."
- Core flywheel: Private work -> selected proof -> public portfolio -> attention -> leads -> business -> revenue -> ownership -> freedom -> more time for purpose/service.
- Decision rule: "AI recommends; Yusuf decides."
- Maintain strict confidentiality of private goals, financial numbers, and internal strategy.
- Your tone is executive, crisp, strategic, pragmatic, and encouraging.
- Always offer high-leverage next actions.
`;

/**
 * Ask the AI Chief of Staff a question or request advice.
 */
export async function askChiefOfStaff(
  prompt: string,
  history: ChiefOfStaffMessage[] = [],
  contextData?: Record<string, unknown>
): Promise<string> {
  const client = getGeminiClient();

  if (!client) {
    return (
      "⚠️ **Gemini API Key belum dikonfigurasi.**\n\n" +
      "Silakan tambahkan `AI_API_KEY` atau `GEMINI_API_KEY` di file `.env.local` untuk mengaktifkan kecerdasan AI Chief of Staff secara live.\n\n" +
      "*Mode Preview:* Berdasarkan prinsip Yusuf OS, fokuslah pada prioritas sprint 90 hari aktif, validasi bukti (*proof*), dan eksekusi tugas berdampak tertinggi."
    );
  }

  try {
    const formattedContext = contextData ? `\n[Current Context Data: ${JSON.stringify(contextData)}]` : "";
    const fullInput = `${prompt}${formattedContext}`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullInput,
      config: {
        systemInstruction: CHIEF_OF_STAFF_SYSTEM_PROMPT,
      },
    });

    return response.text || "Tidak ada respons yang dihasilkan oleh model.";
  } catch (error: any) {
    console.error("Gemini Chief of Staff Error:", error);
    return `Gagal menghubungi AI Chief of Staff: ${error?.message || "Unknown error"}`;
  }
}

/**
 * Automatically parse and triage raw notes / quick captures into actionable items.
 */
export async function triageQuickCapture(rawNote: string): Promise<QuickCaptureTriage> {
  const client = getGeminiClient();

  if (!client) {
    // Fallback heuristic parser when API key is not yet set
    const lower = rawNote.toLowerCase();
    let category: QuickCaptureTriage["category"] = "note";
    if (lower.includes("beli") || lower.includes("bayar") || lower.includes("rp") || lower.includes("biaya") || lower.includes("invest")) {
      category = "wealth";
    } else if (lower.includes("kerjakan") || lower.includes("buat") || lower.includes("todo") || lower.includes("selesaikan")) {
      category = "task";
    } else if (lower.includes("target") || lower.includes("goal") || lower.includes("okr")) {
      category = "goal";
    } else if (lower.includes("selesai") || lower.includes("hasil") || lower.includes("sertifikat") || lower.includes("projek")) {
      category = "evidence";
    } else if (lower.includes("ide") || lower.includes("konsep")) {
      category = "idea";
    }

    return {
      category,
      title: rawNote.slice(0, 50),
      summary: rawNote,
      suggestedPriority: "medium",
      nextAction: "Review dan jadwalkan ke sprint aktif",
      tags: [category, "quick-capture"],
    };
  }

  try {
    const prompt = `
Analyze the following raw personal note from Yusuf and categorize it for Yusuf OS:
Raw note: "${rawNote}"

Respond ONLY with valid JSON conforming to this schema:
{
  "category": "task" | "goal" | "idea" | "wealth" | "evidence" | "note",
  "title": "Short descriptive title (max 60 chars)",
  "summary": "Clear 1-sentence summary",
  "suggestedPriority": "high" | "medium" | "low",
  "nextAction": "Single concrete next step",
  "tags": ["array", "of", "keywords"]
}
`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an accurate JSON categorization engine for personal OS. Always output valid JSON only.",
      }
    });

    const text = response.text?.trim() || "{}";
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleaned) as QuickCaptureTriage;
  } catch (error) {
    console.error("Gemini Triage Error:", error);
    return {
      category: "note",
      title: rawNote.slice(0, 50),
      summary: rawNote,
      suggestedPriority: "medium",
      nextAction: "Proses secara manual di Command Center",
      tags: ["quick-capture"],
    };
  }
}
