import type { Controller } from "app/store/controller/types";
import type { Device } from "app/store/device/types";
import type { Machine } from "app/store/machine/types";
import type { Model } from "app/store/types/model";
import type { TSFixMe } from "app/base/types";

export type DHCPSnippetHistory = Model & {
  created: string;
  value: string;
};

export type DHCPSnippet = Model & {
  created: string;
  description: string;
  enabled: boolean;
  history: DHCPSnippetHistory[];
  name: string;
  node: Controller | Machine | Device | null;
  subnet: TSFixMe | null; // Replace with Subnet["id"] when the Subnet type has been defined.
  updated: string;
  value: string;
};

export type DHCPSnippetState = {
  errors: TSFixMe;
  items: DHCPSnippet[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
