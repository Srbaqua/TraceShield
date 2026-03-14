export interface TraceStep {
  agent: string
  action: string
  result: any
  timestamp: string
}

export function createTrace() {
  return {
    traceId: `trace_${Date.now()}`,
    steps: [] as TraceStep[]
  }
}

export function addTraceStep(trace: any, agent: string, action: string, result: any) {

  trace.steps.push({
    agent,
    action,
    result,
    timestamp: new Date().toISOString()
  })

}