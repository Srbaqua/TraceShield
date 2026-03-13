export function calculateRiskScore(data: any) {

  let riskScore = 0;

  const { amount } = data;

  if (amount > 5000) {
    riskScore += 3;
  }

  if (amount > 20000) {
    riskScore += 5;
  }

  if (amount > 50000) {
    riskScore += 10;
  }

  return {
    riskScore,
    level:
      riskScore > 10 ? "HIGH" :
      riskScore > 5 ? "MEDIUM" :
      "LOW"
  };

}