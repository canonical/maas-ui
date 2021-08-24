import type { APIError } from "app/base/types";
import type { Model } from "app/store/types/model";
import type { GenericState } from "app/store/types/state";
import type { User } from "app/store/user/types";

export type KeySource = {
  auth_id: string;
  protocol: string;
};

export type SSHKey = Model & {
  created: string;
  display: string;
  key: string;
  keysource?: KeySource | null;
  updated: string;
  user: User["id"];
};

export type SSHKeyState = GenericState<SSHKey, APIError>;
