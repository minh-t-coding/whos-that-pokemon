import { Difficulty } from '../../utils/game-type';

const difficultyModifiers: Record<
  Difficulty,
  { rewardMultiplier: number; penaltyMultiplier: number }
> = {
  kanto: { rewardMultiplier: 1, penaltyMultiplier: 1 },
  johto: { rewardMultiplier: 1.4, penaltyMultiplier: 1.6 },
  world: { rewardMultiplier: 1.8, penaltyMultiplier: 2.2 },
};

export function calculateScore(
  timeTaken: number,
  hintsUsed: number,
  difficulty: Difficulty
): number {
  let timeBonus = 10;
  if (timeTaken <= 5) timeBonus = 50;
  else if (timeTaken <= 10) timeBonus = 40;
  else if (timeTaken <= 20) timeBonus = 30;
  else if (timeTaken <= 30) timeBonus = 20;

  const baseScore = 100;
  const { rewardMultiplier } = difficultyModifiers[difficulty];
  const totalScore = (baseScore + timeBonus) * rewardMultiplier;
  return Math.max(10, totalScore);
}

export function calculateHintPenalty(hintType: string, difficulty: Difficulty): number {
  const hintPenalties: Record<string, number> = {
    cry: 3,
    types: 6,
    blur: 9,
    reveal: 12,
  };
  const { penaltyMultiplier } = difficultyModifiers[difficulty];
  return (hintPenalties[hintType] || 0) * penaltyMultiplier;
}

export function calculateTryPenalty(tryNumber: number, difficulty: Difficulty): number {
  const tryPenaltyStep = 5;
  const { penaltyMultiplier } = difficultyModifiers[difficulty];
  return tryNumber * tryPenaltyStep * penaltyMultiplier;
}
