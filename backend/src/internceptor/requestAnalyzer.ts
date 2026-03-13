export interface RequestData {
  service: string
  action: string
  amount?: number
  user?: string
}

export function analyzeRequest(data: RequestData) {

  console.log("Analyzing request:", data)

  // basic anomaly detection (temporary)
  if (data.amount && data.amount > 100000) {
    return {
      decision: "BLOCK",
      reason: "Transaction amount exceeds safe threshold"
    }
  }

  return {
    decision: "ALLOW",
    reason: "Request appears normal"
  }
}