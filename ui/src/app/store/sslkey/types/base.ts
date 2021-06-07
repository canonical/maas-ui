import type { TSFixMe } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";
import type { User, UserMeta } from "app/store/user/types";

export type SSLKey = Model & {
  created: string;
  display: string;
  key: string;
  updated: string;
  user: User[UserMeta.PK];
};

export type SSLKeyState = GenericState<SSLKey, TSFixMe>;
