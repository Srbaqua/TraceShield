export function analyzeWithAI(data: any) {

  const { amount, user } = data;

  let anomalyScore = 0;

  // basic behavioral heuristics
  if (amount > 5000) {
    anomalyScore += 5;
  }

  if (amount > 20000) {
    anomalyScore += 10;
  }

  return {
    anomalyScore,
    analysis: anomalyScore > 5
      ? "Suspicious transaction behavior detected"
      : "Transaction appears normal"
  };

}