/** Estimated remaining battery life band from SoH (demo heuristic, not a prediction). */
export function estimateLife(soh: number): string {
  if (soh >= 90) return '8+ years';
  if (soh >= 85) return '6–8 years';
  if (soh >= 80) return '4–6 years';
  return '2–4 years';
}
