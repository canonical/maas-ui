import type { SslKeyResponse } from "../apiclient";

import type { Token } from "@/app/store/token/types";
import { argPath } from "@/app/utils";

const urls = {
  apiKeys: {
    add: "/account/prefs/api-keys/add",
    edit: argPath<{ id: Token["id"] }>("/account/prefs/api-keys/:id/edit"),
    delete: argPath<{ id: Token["id"] }>("/account/prefs/api-keys/:id/delete"),
    index: "/account/prefs/api-keys",
  },
  details: "/account/prefs/details",
  index: "/account/prefs",
  sshKeys: {
    add: "/account/prefs/ssh-keys/add",
    delete: "/account/prefs/ssh-keys/delete",
    index: "/account/prefs/ssh-keys",
  },
  sslKeys: {
    add: "/account/prefs/ssl-keys/add",
    delete: argPath<{ id: SslKeyResponse["id"] }>(
      "/account/prefs/ssl-keys/:id/delete"
    ),
    index: "/account/prefs/ssl-keys",
  },
};

export default urls;
