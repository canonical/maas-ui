import type { APIError } from "app/base/types";
import type { TimestampedModel } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";
import type { User, UserMeta } from "app/store/user/types";

export type SSLKey = TimestampedModel & {
  display: string;
  key: string;
  user: User[UserMeta.PK];
};

export type SSLKeyState = GenericState<SSLKey, APIError>;
