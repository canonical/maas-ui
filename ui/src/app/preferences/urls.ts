import type { Token } from "app/store/token/types";
import { argPath } from "app/utils";

const urls = {
  apiAuthentication: {
    index: "/account/prefs/api-authentication",
    keys: {
      add: "/account/prefs/api-authentication/keys/add",
      edit: argPath<{ id: Token["id"] }>(
        "/account/prefs/api-authentication/keys/:id/edit"
      ),
    },
  },
  details: "/account/prefs/details",
  prefs: "/account/prefs",
  sshKeys: {
    add: "/account/prefs/ssh-keys/add",
    index: "/account/prefs/ssh-keys",
  },
  sslKeys: {
    add: "/account/prefs/ssl-keys/add",
    index: "/account/prefs/ssl-keys",
  },
};

export default urls;
