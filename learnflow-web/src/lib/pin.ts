export const DEMO_PIN = "1234";
export const DEMO_OTP = "123456";

export function pinsMatch(input: string, expected = DEMO_PIN) {
  return input.trim() === expected;
}
