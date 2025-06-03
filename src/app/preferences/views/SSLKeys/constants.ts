import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const SSLKeyActionSidePanelViews = {
  ADD_SSL_KEY: ["sslKeyForm", "addSSLKey"],
  DELETE_SSL_KEY: ["sslKeyForm", "deleteSSLKey"],
} as const;

export type SSLKeySidePanelContent = SidePanelContent<
  ValueOf<typeof SSLKeyActionSidePanelViews>,
  { sslKeyId: number }
>;
