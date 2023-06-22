import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { usePrevious } from "@canonical/react-components";
import { useLocation } from "react-router-dom-v5-compat";

import type { ControllerSidePanelContent } from "app/controllers/types";
import type { DashboardSidePanelContent } from "app/dashboard/views/constants";
import type { DeviceSidePanelContent } from "app/devices/types";
import type { DomainDetailsSidePanelContent } from "app/domains/views/DomainDetails/constants";
import type { DomainListSidePanelContent } from "app/domains/views/DomainsList/constants";
import type { KVMSidePanelContent } from "app/kvm/types";
import type { MachineSidePanelContent } from "app/machines/types";
import type { SubnetSidePanelContent } from "app/subnets/types";
import type { FabricDetailsSidePanelContent } from "app/subnets/views/FabricDetails/FabricDetailsHeader/constants";
import type { SpaceDetailsSidePanelContent } from "app/subnets/views/SpaceDetails/constants";
import type { SubnetDetailsSidePanelContent } from "app/subnets/views/SubnetDetails/constants";
import type { VLANDetailsSidePanelContent } from "app/subnets/views/VLANDetails/constants";
import type { TagSidePanelContent } from "app/tags/types";
import type { ZoneSidePanelContent } from "app/zones/constants";

export type SidePanelContent =
  | MachineSidePanelContent
  | ControllerSidePanelContent
  | DeviceSidePanelContent
  | KVMSidePanelContent
  | TagSidePanelContent
  | ZoneSidePanelContent
  | SubnetSidePanelContent
  | DomainDetailsSidePanelContent
  | DomainListSidePanelContent
  | DashboardSidePanelContent
  | VLANDetailsSidePanelContent
  | FabricDetailsSidePanelContent
  | SubnetDetailsSidePanelContent
  | SpaceDetailsSidePanelContent
  | null;

export type SetSidePanelContent = (sidePanelContent: SidePanelContent) => void;

export type SidePanelContextType<T = SidePanelContent> = {
  sidePanelContent: T;
};

export type SetSidePanelContextType = {
  setSidePanelContent: SetSidePanelContent;
};

const SidePanelContext = createContext<SidePanelContextType>({
  sidePanelContent: null,
});

const SetSidePanelContext = createContext<SetSidePanelContextType>({
  setSidePanelContent: () => {},
});

const useSidePanelContext = (): SidePanelContextType =>
  useContext(SidePanelContext);
const useSetSidePanelContext = (): SetSidePanelContextType =>
  useContext(SetSidePanelContext);

export const useSidePanel = (): SidePanelContextType &
  SetSidePanelContextType => {
  const { sidePanelContent } = useSidePanelContext();
  const { setSidePanelContent } = useSetSidePanelContext();
  const { pathname } = useLocation();
  const previousPathname = usePrevious(pathname);

  // close side panel on route change
  useEffect(() => {
    if (pathname !== previousPathname) {
      setSidePanelContent(null);
    }
  }, [pathname, previousPathname, setSidePanelContent]);

  // close side panel on unmount
  useEffect(() => {
    return () => setSidePanelContent(null);
  }, [setSidePanelContent]);

  return { sidePanelContent, setSidePanelContent };
};

const SidePanelContextProvider = ({
  children,
  value = null,
}: PropsWithChildren<{ value?: SidePanelContent }>): React.ReactElement => {
  const [sidePanelContent, setSidePanelContent] =
    useState<SidePanelContent>(value);

  return (
    <SetSidePanelContext.Provider
      value={{
        setSidePanelContent,
      }}
    >
      <SidePanelContext.Provider
        value={{
          sidePanelContent,
        }}
      >
        {children}
      </SidePanelContext.Provider>
    </SetSidePanelContext.Provider>
  );
};

export default SidePanelContextProvider;
