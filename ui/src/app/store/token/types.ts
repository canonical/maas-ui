import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";

export enum TokenMeta {
  MODEL = "token",
  PK = "id",
}

export type TokenConsumer = {
  key: string;
  name: string;
};

export type Token = Model & {
  consumer: TokenConsumer;
  key: string;
  secret: string;
};

export type TokenState = GenericState<Token, TSFixMe>;
