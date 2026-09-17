import { NextBestAction, QuickCaptureItem } from "../types";

// Base URL for the Yusuf OS Next.js Backend.
// In Android Emulator use: http://10.0.2.2:3001
// On physical device use your local network IP (e.g. http://192.168.1.x:3001)
// On Web/Default: http://localhost:3001
let API_BASE_URL = "http://localhost:3001";

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url.replace(/\/$/, "");
};

export const getApiBaseUrl = () => API_BASE_URL;

/**
 * Send raw quick capture note to AI for automatic triage and classification.
 */
export async function triageNoteWithAI(note: string): Promise<Partial<QuickCaptureItem>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/triage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.ok && data.result) {
      return {
        category: data.result.category,
        title: data.result.title,
        summary: data.result.summary,
        suggestedPriority: data.result.suggestedPriority,
        nextAction: data.result.nextAction,
        tags: data.result.tags || [],
      };
    }
  } catch (error) {
    console.warn("API Triage fallback:", error);
  }

  // Local fallback
  return {
    category: "note",
    title: note.slice(0, 40),
    summary: note,
    suggestedPriority: "medium",
    nextAction: "Review di Command Center",
    tags: ["quick-capture"],
  };
}

/**
 * Chat with AI Chief of Staff.
 */
export async function askChiefOfStaff(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/chief-of-staff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.ok && data.reply) {
      return data.reply;
    }
    return data.error || "Gagal mendapatkan respon dari AI.";
  } catch (error: any) {
    return "Tidak dapat terhubung ke server Yusuf OS. Pastikan server web aktif di http://localhost:3001.";
  }
}

/**
 * Fetch live or simulated Next Best Actions.
 */
export async function fetchNextBestActions(): Promise<NextBestAction[]> {
  return [
    {
      id: "nba-1",
      title: "Selesaikan Roadmap Eksekusi Q3",
      reason: "Batas waktu sprint tersisa 12 hari. Validasi bukti proyek selesai.",
      impactScore: 9,
      effortMinutes: 45,
      priorityRank: 1,
      status: "recommended",
    },
    {
      id: "nba-2",
      title: "Review & Publish 1 Portfolio Case Study",
      reason: "Tingkatkan metrik Proof & Distribution untuk mendatangkan lead inbound.",
      impactScore: 8,
      effortMinutes: 30,
      priorityRank: 2,
      status: "recommended",
    },
    {
      id: "nba-3",
      title: "Update Snapshot Asset & Net Worth",
      reason: "Pertahankan visibilitas pilar Ownership & Financial Independence.",
      impactScore: 7,
      effortMinutes: 15,
      priorityRank: 3,
      status: "recommended",
    },
  ];
}
