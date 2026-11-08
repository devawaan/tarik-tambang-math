import { MathQuestion, OperationType } from '../types/game';

/**
 * Generate math questions with dynamic difficulty progression
 * based on elapsed game duration and round level.
 */
export function generateQuestion(difficultyLevel: number = 1, allowedOps: OperationType = 'MIXED'): MathQuestion {
  // difficultyLevel: 1 (easy), 2 (medium/image like "14 + 8"), 3 (hard), 4 (expert)
  let num1 = 0;
  let num2 = 0;
  let op: '+' | '-' | '×' | '÷' = '+';
  let correctAnswer = 0;

  // Choose operation based on level and allowed ops
  let availableOps: ('+' | '-' | '×' | '÷')[] = ['+', '-'];
  if (difficultyLevel >= 3) {
    availableOps.push('×');
  }
  if (difficultyLevel >= 4) {
    availableOps.push('÷');
  }

  if (allowedOps === 'ADD') availableOps = ['+'];
  else if (allowedOps === 'SUB') availableOps = ['-'];
  else if (allowedOps === 'MUL') availableOps = ['×'];
  else if (allowedOps === 'DIV') availableOps = ['÷'];

  op = availableOps[Math.floor(Math.random() * availableOps.length)];

  switch (op) {
    case '+': {
      if (difficultyLevel === 1) {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
      } else if (difficultyLevel === 2) {
        // e.g. 14 + 8 as in prompt screenshot
        num1 = Math.floor(Math.random() * 30) + 10;
        num2 = Math.floor(Math.random() * 15) + 3;
      } else if (difficultyLevel === 3) {
        num1 = Math.floor(Math.random() * 60) + 20;
        num2 = Math.floor(Math.random() * 45) + 12;
      } else {
        num1 = Math.floor(Math.random() * 99) + 35;
        num2 = Math.floor(Math.random() * 88) + 25;
      }
      correctAnswer = num1 + num2;
      break;
    }
    case '-': {
      if (difficultyLevel === 1) {
        num2 = Math.floor(Math.random() * 8) + 1;
        num1 = num2 + Math.floor(Math.random() * 9) + 1;
      } else if (difficultyLevel === 2) {
        num2 = Math.floor(Math.random() * 20) + 5;
        num1 = num2 + Math.floor(Math.random() * 25) + 5;
      } else if (difficultyLevel === 3) {
        num2 = Math.floor(Math.random() * 45) + 10;
        num1 = num2 + Math.floor(Math.random() * 50) + 15;
      } else {
        num2 = Math.floor(Math.random() * 80) + 20;
        num1 = num2 + Math.floor(Math.random() * 90) + 25;
      }
      correctAnswer = num1 - num2;
      break;
    }
    case '×': {
      if (difficultyLevel <= 3) {
        num1 = Math.floor(Math.random() * 8) + 2;
        num2 = Math.floor(Math.random() * 8) + 2;
      } else {
        num1 = Math.floor(Math.random() * 11) + 3;
        num2 = Math.floor(Math.random() * 12) + 3;
      }
      correctAnswer = num1 * num2;
      break;
    }
    case '÷': {
      // Create clean integer division
      const divisor = Math.floor(Math.random() * 8) + 2;
      const quotient = Math.floor(Math.random() * (difficultyLevel >= 4 ? 12 : 9)) + 2;
      num1 = divisor * quotient;
      num2 = divisor;
      correctAnswer = quotient;
      break;
    }
  }

  // Generate 3 plausible distractors
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    let offset = Math.floor(Math.random() * 5) + 1;
    if (Math.random() > 0.5) offset = -offset;

    // Sometimes off by 10
    if (Math.random() > 0.6 && correctAnswer > 10) {
      offset = (Math.random() > 0.5 ? 10 : -10);
    }

    const wrong = correctAnswer + offset;
    if (wrong !== correctAnswer && wrong >= 0) {
      distractors.add(wrong);
    }
  }

  const options = Array.from(distractors);
  options.push(correctAnswer);

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    num1,
    num2,
    operation: op,
    expression: `${num1} ${op} ${num2} = ?`,
    correctAnswer,
    options
  };
}
