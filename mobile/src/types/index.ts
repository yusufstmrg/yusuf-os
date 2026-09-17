export type CategoryType = "task" | "goal" | "idea" | "wealth" | "evidence" | "note";

export interface QuickCaptureItem {
  id: string;
  category: CategoryType;
  title: string;
  summary: string;
  suggestedPriority: "high" | "medium" | "low";
  nextAction: string;
  tags: string[];
  createdAt: string;
}

export interface NextBestAction {
  id: string;
  title: string;
  reason: string;
  impactScore: number;
  effortMinutes: number;
  priorityRank: number;
  status: "recommended" | "in_progress" | "done";
}

export interface SprintGoal {
  id: string;
  title: string;
  progress: number;
  category: string;
  status: "on_track" | "at_risk" | "completed";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "chief";
  text: string;
  timestamp: string;
}
