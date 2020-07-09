import { array, define } from "cooky-cutter";

import { message } from "./message";
import { notification } from "./notification";
import { user } from "./user";
import type { AuthState, UserState } from "app/store/user/types";
import type { ConfigState } from "app/store/config/types";
import type { DHCPSnippetState } from "app/store/dhcpsnippet/types";
import type { LicenseKeysState } from "app/store/licensekeys/types";
import type { MessageState } from "app/store/message/types";
import type { NotificationState } from "app/store/notification/types";
import type { PackageRepositoryState } from "app/store/packagerepository/types";
import type { PodState } from "app/store/pod/types";
import type { ScriptsState } from "app/store/scripts/types";
import type { SSHKeyState } from "app/store/sshkey/types";
import type { SSLKeyState } from "app/store/sslkey/types";
import type { TokenState } from "app/store/token/types";

const defaultState = {
  errors: () => ({}),
  items: () => [],
  loaded: false,
  loading: false,
  saved: false,
  saving: false,
};

export const authState = define<AuthState>({
  ...defaultState,
  errors: () => ({}),
  user,
});

export const configState = define<ConfigState>({
  ...defaultState,
});

export const dhcpSnippetState = define<DHCPSnippetState>({
  ...defaultState,
});

export const licenseKeysState = define<LicenseKeysState>({
  ...defaultState,
});

export const scriptsState = define<ScriptsState>({
  ...defaultState,
});

export const sshKeyState = define<SSHKeyState>({
  ...defaultState,
  errors: null,
});

export const sslKeyState = define<SSLKeyState>({
  ...defaultState,
  errors: null,
});

export const tokenState = define<TokenState>({
  ...defaultState,
  errors: null,
});

export const packageRepositoryState = define<PackageRepositoryState>({
  ...defaultState,
});

export const userState = define<UserState>({
  ...defaultState,
  auth: authState,
  items: array(user),
});

export const podState = define<PodState>({
  ...defaultState,
  selected: () => [],
  statuses: () => ({}),
});

export const notificationState = define<NotificationState>({
  ...defaultState,
  errors: null,
  items: array(notification),
});

export const messageState = define<MessageState>({
  items: array(message),
});
