export type Model = {
  id: number;
};

export type TimestampFields = {
  created: string;
  updated: string;
};

export type TimestampedModel = Model & TimestampFields;

/**
 * A named foreign model reference, e.g. machine.domain
 */
export type ModelRef = Model & {
  name: string;
};
