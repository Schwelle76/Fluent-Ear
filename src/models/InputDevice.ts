export const INPUT_DEVICES = ['keyboard', 'microphone'] as const;
export type InputDevice = typeof INPUT_DEVICES[number];