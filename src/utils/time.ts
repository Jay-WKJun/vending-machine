export function second(seconds: number) {
  return seconds * 1000;
}

export function minute(minutes: number) {
  return minutes * second(60);
}
