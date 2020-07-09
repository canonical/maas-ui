import { define, extend } from "cooky-cutter";

import { model } from "./model";
import type { Model } from "app/store/types/model";
import type { Token, TokenConsumer } from "app/store/token/types";

export const tokenConsumer = define<TokenConsumer>({
  key: "consumer key",
  name: "consumer name",
});

export const token = extend<Model, Token>(model, {
  consumer: tokenConsumer,
  key: "token key",
  secret: "secret key",
});
