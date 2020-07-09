import type { Model } from "app/store/types/model";
import type { User } from "app/store/user/types";
import type { TSFixMe } from "app/base/types";

export type KeySource = {
  auth_id: string;
  protocol: string;
};

export type SSHKey = Model & {
  created: string;
  display: string;
  key: string;
  keysource: KeySource;
  updated: string;
  user: User["id"];
};

export type SSHKeyState = {
  errors: TSFixMe;
  items: SSHKey[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
