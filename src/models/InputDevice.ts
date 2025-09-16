export const INPUT_DEVICES = ['keyboard', 'microphone', 'ui'] as const;
export type InputDevice = typeof INPUT_DEVICES[number];