export interface TraceEntry {
  traceId: string;
  timestamp: string;
  step: string;
  duration: number;
}

export interface Trace {
  id: string;
  entries: TraceEntry[];
  startTime: string;
  endTime?: string;
}

export function serializeTrace(trace: Trace): string {
  return JSON.stringify(trace);
}

export function deserializeTrace(json: string): Trace {
  const parsed = JSON.parse(json);
  return {
    id: parsed.id,
    entries: parsed.entries,
    startTime: parsed.startTime,
    endTime: parsed.endTime,
  };
}
