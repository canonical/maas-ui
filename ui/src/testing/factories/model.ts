import { define, extend, random, sequence } from "cooky-cutter";

import type { Model, ModelRef } from "app/store/types/model";

export const model = define<Model>({
  id: sequence,
});

export const modelRef = extend<Model, ModelRef>(model, {
  name: `modelref-${random}`,
});
