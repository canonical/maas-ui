import { define, extend } from "cooky-cutter";

import { model } from "./model";

import type { Token, TokenConsumer } from "app/store/token/types";
import type { Model } from "app/store/types/model";

export const tokenConsumer = define<TokenConsumer>({
  key: "consumer key",
  name: "consumer name",
});

export const token = extend<Model, Token>(model, {
  consumer: tokenConsumer,
  key: "token key",
  secret: "secret key",
});
