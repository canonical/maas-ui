import type { PropsWithChildren, ReactElement } from "react";
import { createContext, useCallback, useContext, useState } from "react";

import type { RepositorySidePanelContent } from "../settings/views/Repositories/constants";
import { RepositoryActionSidePanelViews } from "../settings/views/Repositories/constants";

import { ControllerSidePanelViews } from "@/app/controllers/constants";
import type { ControllerSidePanelContent } from "@/app/controllers/types";
import { DeviceSidePanelViews } from "@/app/devices/constants";
import type { DeviceSidePanelContent } from "@/app/devices/types";
import {
  DomainDetailsSidePanelViews,
  type DomainDetailsSidePanelContent,
} from "@/app/domains/views/DomainDetails/constants";
import {
  DomainListSidePanelViews,
  type DomainListSidePanelContent,
} from "@/app/domains/views/DomainsList/constants";
import { ImageSidePanelViews } from "@/app/images/constants";
import type { ImageSidePanelContent } from "@/app/images/types";
import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { KVMSidePanelContent } from "@/app/kvm/types";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { MachineSidePanelContent } from "@/app/machines/types";
import {
  NetworkDiscoverySidePanelViews,
  type NetworkDiscoverySidePanelContent,
} from "@/app/networkDiscovery/constants";
import type { PoolSidePanelContent } from "@/app/pools/constants";
import { PoolActionSidePanelViews } from "@/app/pools/constants";
import type { SSHKeySidePanelContent } from "@/app/preferences/views/SSHKeys/constants";
import { SSHKeyActionSidePanelViews } from "@/app/preferences/views/SSHKeys/constants";
import type { SSLKeySidePanelContent } from "@/app/preferences/views/SSLKeys/constants";
import { SSLKeyActionSidePanelViews } from "@/app/preferences/views/SSLKeys/constants";
import { UserActionSidePanelViews } from "@/app/settings/views/Users/constants";
import type { UserSidePanelContent } from "@/app/settings/views/Users/constants";
import type { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import {
  SubnetSidePanelViews,
  type SubnetSidePanelContent,
} from "@/app/subnets/types";
import {
  FabricDetailsSidePanelViews,
  type FabricDetailsSidePanelContent,
} from "@/app/subnets/views/FabricDetails/FabricDetailsHeader/constants";
import {
  SpaceDetailsSidePanelViews,
  type SpaceDetailsSidePanelContent,
} from "@/app/subnets/views/SpaceDetails/constants";
import {
  SubnetDetailsSidePanelViews,
  type SubnetDetailsSidePanelContent,
} from "@/app/subnets/views/SubnetDetails/constants";
import {
  VLANDetailsSidePanelViews,
  type VLANDetailsSidePanelContent,
} from "@/app/subnets/views/VLANDetails/constants";
import { TagSidePanelViews } from "@/app/tags/constants";
import type { TagSidePanelContent } from "@/app/tags/types";
import {
  ZoneActionSidePanelViews,
  type ZoneSidePanelContent,
} from "@/app/zones/constants";

export type SidePanelContent =
  | ControllerSidePanelContent
  | DeviceSidePanelContent
  | DomainDetailsSidePanelContent
  | DomainListSidePanelContent
  | FabricDetailsSidePanelContent
  | ImageSidePanelContent
  | KVMSidePanelContent
  | MachineSidePanelContent
  | NetworkDiscoverySidePanelContent
  | PoolSidePanelContent
  | RepositorySidePanelContent
  | SpaceDetailsSidePanelContent
  | SSHKeySidePanelContent
  | SSLKeySidePanelContent
  | SubnetDetailsSidePanelContent
  | SubnetSidePanelContent
  | TagSidePanelContent
  | UserSidePanelContent
  | VLANDetailsSidePanelContent
  | ZoneSidePanelContent
  | null;

export type SetSidePanelContent<T = SidePanelContent> = (
  sidePanelContent: T | null
) => void;

export type SidePanelSize = "large" | "narrow" | "regular" | "wide";
export type SidePanelContextType<T = SidePanelContent> = {
  sidePanelContent: T | null;
  sidePanelSize: SidePanelSize;
};

export const SidePanelViews = {
  ...ControllerSidePanelViews,
  ...MachineSidePanelViews,
  ...ControllerSidePanelViews,
  ...DeviceSidePanelViews,
  ...KVMSidePanelViews,
  ...TagSidePanelViews,
  ...UserActionSidePanelViews,
  ...ZoneActionSidePanelViews,
  ...SubnetSidePanelViews,
  ...DomainDetailsSidePanelViews,
  ...DomainListSidePanelViews,
  ...NetworkDiscoverySidePanelViews,
  ...VLANDetailsSidePanelViews,
  ...FabricDetailsSidePanelViews,
  ...ImageSidePanelViews,
  ...SSHKeyActionSidePanelViews,
  ...SSLKeyActionSidePanelViews,
  ...PoolActionSidePanelViews,
  ...SubnetDetailsSidePanelViews,
  ...SpaceDetailsSidePanelViews,
  ...RepositoryActionSidePanelViews,
} as const;

const sidePanelTitleMap: Record<string, string> = {
  [SidePanelViews.ADD_ALIAS[1]]: "Add alias",
  [SidePanelViews.ADD_BOND[1]]: "Create bond",
  [SidePanelViews.ADD_BRIDGE[1]]: "Create bridge",
  [SidePanelViews.ADD_CONTROLLER[1]]: "Add controller",
  [SidePanelViews.ADD_CHASSIS[1]]: "Add chassis",
  [SidePanelViews.ADD_DISCOVERY[1]]: "Add discovery",
  [SidePanelViews.ADD_DOMAIN[1]]: "Add domains",
  [SidePanelViews.ADD_INTERFACE[1]]: "Add interface",
  [SidePanelViews.ADD_MACHINE[1]]: "Add machine",
  [SidePanelViews.ADD_DEVICE[1]]: "Add device",
  [SidePanelViews.ADD_SPECIAL_FILESYSTEM[1]]: "Add special filesystem",
  [SidePanelViews.ADD_SSH_KEY[1]]: "Add SSH key",
  [SidePanelViews.DELETE_SSH_KEY[1]]: "Delete SSH key",
  [SidePanelViews.ADD_SSL_KEY[1]]: "Add SSL key",
  [SidePanelViews.DELETE_SSL_KEY[1]]: "Delete SSL key",
  [SidePanelViews.AddTag[1]]: "Create new tag",
  [SidePanelViews.ADD_VLAN[1]]: "Add VLAN",
  [SidePanelViews.APPLY_STORAGE_LAYOUT[1]]: "Change storage layout",
  [SidePanelViews.CLEAR_ALL_DISCOVERIES[1]]: "Clear all discoveries",
  [SidePanelViews.CREATE_BCACHE[1]]: "Create bcache",
  [SidePanelViews.CREATE_CACHE_SET[1]]: "Create cache set",
  [SidePanelViews.CREATE_DATASTORE[1]]: "Create datastore",
  [SidePanelViews.CREATE_LOGICAL_VOLUME[1]]: "Create logical volume",
  [SidePanelViews.CREATE_PARTITION[1]]: "Create partition",
  [SidePanelViews.CREATE_RAID[1]]: "Create raid",
  [SidePanelViews.CREATE_VOLUME_GROUP[1]]: "Create volume group",
  [SidePanelViews.DELETE_DISCOVERY[1]]: "Delete discovery",
  [SidePanelViews.DELETE_DISK[1]]: "Delete disk",
  [SidePanelViews.DELETE_FILESYSTEM[1]]: "Delete filesystem",
  [SidePanelViews.DELETE_SPECIAL_FILESYSTEM[1]]: "Delete special filesystem",
  [SidePanelViews.DeleteTag[1]]: "Delete tag",
  [SidePanelViews.DELETE_VOLUME_GROUP[1]]: "Delete volume group",
  [SidePanelViews.DOWNLOAD_IMAGE[1]]: "Select upstream images to sync",
  [SidePanelViews.EDIT_INTERFACE[1]]: "Edit interface",
  [SidePanelViews.CREATE_ZONE[1]]: "Add AZ",
  [SidePanelViews.EDIT_ZONE[1]]: "Edit AZ",
  [SidePanelViews.DELETE_ZONE[1]]: "Delete AZ",
  [SidePanelViews.EDIT_DISK[1]]: "Edit disk",
  [SidePanelViews.EDIT_PARTITION[1]]: "Edit partition",
  [SidePanelViews.EDIT_PHYSICAL[1]]: "Edit physical",
  [SidePanelViews.DELETE_IMAGE[1]]: "Delete image",
  [SidePanelViews.DELETE_MULTIPLE_IMAGES[1]]: "Delete multiple images",
  [SidePanelViews.DELETE_SPACE[1]]: "Delete space",
  [SidePanelViews.DELETE_FABRIC[1]]: "Delete fabric",
  [SidePanelViews.MARK_CONNECTED[1]]: "Mark as connected",
  [SidePanelViews.MARK_DISCONNECTED[1]]: "Mark as disconnected",
  [SidePanelViews.REMOVE_INTERFACE[1]]: "Remove interface",
  [SidePanelViews.REMOVE_PARTITION[1]]: "Remove partition",
  [SidePanelViews.REMOVE_PHYSICAL[1]]: "Remove physical",
  [SidePanelViews.SET_BOOT_DISK[1]]: "Set boot disk",
  [SidePanelViews.SET_DEFAULT[1]]: "Set default",
  [SidePanelViews.UNMOUNT_FILESYSTEM[1]]: "Unmount filesystem",
  [SidePanelViews.UPDATE_DATASTORE[1]]: "Update datastore",
  [SidePanelViews.UpdateTag[1]]: "Update Tag",
  [SidePanelViews.CREATE_POOL[1]]: "Add pool",
  [SidePanelViews.EDIT_POOL[1]]: "Edit pool",
  [SidePanelViews.DELETE_POOL[1]]: "Delete pool",
  [SidePanelViews.CREATE_USER[1]]: "Add user",
  [SidePanelViews.EDIT_USER[1]]: "Edit user",
  [SidePanelViews.DELETE_USER[1]]: "Delete user",
  [SidePanelViews.ADD_REPOSITORY[1]]: "Add repository",
  [SidePanelViews.ADD_PPA[1]]: "Add PPA",
  [SidePanelViews.EDIT_REPOSITORY[1]]: "Edit repository",
  [SidePanelViews.DELETE_REPOSITORY[1]]: "Delete repository",
};

/**
 * Get title depending on side panel content.
 * @param defaultTitle - Title to show if no header content open.
 * @param sidePanelContent - The name of the header content to check.
 * @returns Header title string.
 */
export const getSidePanelTitle = (
  defaultTitle: string,
  sidePanelContent: SidePanelContent | null
): string => {
  if (sidePanelContent) {
    const [, name] = sidePanelContent.view;
    return (
      sidePanelTitleMap[name] ||
      getNodeActionTitle(name as NodeActions) ||
      defaultTitle
    );
  }
  return defaultTitle;
};

export type SetSidePanelContextType = {
  setSidePanelContent: SetSidePanelContent;
  setSidePanelSize: (size: SidePanelSize) => void;
};

export type SidePanelContentTypes<T = SidePanelContent> = {
  sidePanelContent: T | null;
  setSidePanelContent: SetSidePanelContent<T>;
};

const SidePanelContext = createContext<SidePanelContextType>({
  sidePanelContent: null,
  sidePanelSize: "regular",
});

const SetSidePanelContext = createContext<SetSidePanelContextType>({
  setSidePanelContent: () => {},
  setSidePanelSize: () => {},
});

const useSidePanelContext = (): SidePanelContextType =>
  useContext(SidePanelContext);

const useSetSidePanelContext = (): SetSidePanelContextType =>
  useContext(SetSidePanelContext);

export const useSidePanel = (): SetSidePanelContextType &
  SidePanelContextType => {
  const { sidePanelSize, sidePanelContent } = useSidePanelContext();
  const { setSidePanelContent, setSidePanelSize } = useSetSidePanelContext();
  const setSidePanelContentWithSizeReset = useCallback(
    (content: SidePanelContent | null): void => {
      if (content === null) {
        setSidePanelSize("regular");
      }
      setSidePanelContent(content);
    },
    [setSidePanelContent, setSidePanelSize]
  );

  return {
    sidePanelContent,
    setSidePanelContent: setSidePanelContentWithSizeReset,
    sidePanelSize,
    setSidePanelSize,
  };
};

const SidePanelContextProvider = ({
  children,
  initialSidePanelContent = null,
  initialSidePanelSize = "regular",
}: PropsWithChildren<{
  initialSidePanelContent?: SidePanelContent;
  initialSidePanelSize?: SidePanelSize;
}>): ReactElement => {
  const [sidePanelContent, setSidePanelContent] = useState<SidePanelContent>(
    initialSidePanelContent
  );
  const [sidePanelSize, setSidePanelSize] =
    useState<SidePanelSize>(initialSidePanelSize);

  return (
    <SetSidePanelContext.Provider
      value={{
        setSidePanelContent,
        setSidePanelSize,
      }}
    >
      <SidePanelContext.Provider
        value={{
          sidePanelContent,
          sidePanelSize,
        }}
      >
        {children}
      </SidePanelContext.Provider>
    </SetSidePanelContext.Provider>
  );
};

export default SidePanelContextProvider;
