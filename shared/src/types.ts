export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

type UsabillaConfig =
  | string
  | {
      [x: string]: unknown;
    };

export type UsabillaLive = (type: string, config?: UsabillaConfig) => void;
