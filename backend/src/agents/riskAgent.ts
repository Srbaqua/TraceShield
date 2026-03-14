export function calculateRiskScore(data: any) {

  let riskScore = 0

  const { amount, user } = data

  if (amount > 3000) riskScore += 2
  if (amount > 10000) riskScore += 4
  if (amount > 50000) riskScore += 8

  if (!user || user.length < 3) riskScore += 2

  return {
    riskScore,
    level:
      riskScore > 10 ? "HIGH" :
      riskScore > 5 ? "MEDIUM" :
      "LOW"
  }
}