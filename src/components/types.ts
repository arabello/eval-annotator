export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ExperimentEntry {
  id: string;
  baseline: Message[];
  candidate_answer?: string;
  span_link?: string;
  notes?: string;
  annotation?: "pass" | "fail";
}

export type Dataset = ExperimentEntry[];
