import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type TokenConsumer = {
  key: string;
  name: string;
};

export type Token = Model & {
  consumer: TokenConsumer;
  key: string;
  secret: string;
};

export type TokenState = {
  errors: TSFixMe;
  items: Token[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
