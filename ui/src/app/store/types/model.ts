export type Model = {
  id: number;
};

/**
 * A named foreign model reference, e.g. machine.domain
 */
export type ModelRef = Model & {
  name: string;
};
