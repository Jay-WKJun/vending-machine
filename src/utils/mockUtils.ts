export async function getRandomSuccessResult(
  successPercentage: number,
  delay = 1000
): Promise<boolean> {
  const random = Math.random() * 100;
  await wait(delay);

  return random <= successPercentage;
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
