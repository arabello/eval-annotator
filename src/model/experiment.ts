import {
  any,
  array,
  InferOutput,
  object,
  optional,
  picklist,
  record,
  string,
} from "valibot";

export const Role = picklist(["user", "assistant"]);
export type Role = InferOutput<typeof Role>;

export const Message = object({
  role: Role,
  content: string(),
});
export type Message = InferOutput<typeof Message>;

export const Annotation = picklist(["pass", "fail"]);
export type Annotation = InferOutput<typeof Annotation>;

export const Context = record(string(), any());
export type Context = InferOutput<typeof Context>;

export const ExperimentEntry = object({
  id: string(),
  messages: array(Message),
  baseline_answer: string(),
  candidate_answer: string(),
  notes: optional(string()),
  annotation: optional(Annotation),
  context: optional(Context),
});
export type ExperimentEntry = InferOutput<typeof ExperimentEntry>;

export const Experiment = object({
  name: string(),
  entries: array(ExperimentEntry),
});
export type Experiment = InferOutput<typeof Experiment>;
