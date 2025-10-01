import type { PropsWithChildren, ReactElement } from "react";
import { createContext, useCallback, useContext, useState } from "react";

import { KVMSidePanelViews } from "@/app/kvm/constants";
import type { KVMSidePanelContent } from "@/app/kvm/types";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { MachineSidePanelContent } from "@/app/machines/types";
import type { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import { TagSidePanelViews } from "@/app/tags/constants";
import type { TagSidePanelContent } from "@/app/tags/types";

export type SidePanelContent =
  | KVMSidePanelContent
  | MachineSidePanelContent
  | TagSidePanelContent
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
  ...MachineSidePanelViews,
  ...KVMSidePanelViews,
  ...TagSidePanelViews,
} as const;

const sidePanelTitleMap: Record<string, string> = {
  [SidePanelViews.ADD_ALIAS[1]]: "Add alias",
  [SidePanelViews.ADD_BOND[1]]: "Create bond",
  [SidePanelViews.ADD_BRIDGE[1]]: "Create bridge",
  [SidePanelViews.ADD_CHASSIS[1]]: "Add chassis",
  [SidePanelViews.ADD_INTERFACE[1]]: "Add interface",
  [SidePanelViews.ADD_MACHINE[1]]: "Add machine",
  [SidePanelViews.ADD_SPECIAL_FILESYSTEM[1]]: "Add special filesystem",
  [SidePanelViews.AddTag[1]]: "Create new tag",
  [SidePanelViews.ADD_VLAN[1]]: "Add VLAN",
  [SidePanelViews.APPLY_STORAGE_LAYOUT[1]]: "Change storage layout",
  [SidePanelViews.CREATE_BCACHE[1]]: "Create bcache",
  [SidePanelViews.CREATE_CACHE_SET[1]]: "Create cache set",
  [SidePanelViews.CREATE_DATASTORE[1]]: "Create datastore",
  [SidePanelViews.CREATE_LOGICAL_VOLUME[1]]: "Create logical volume",
  [SidePanelViews.CREATE_PARTITION[1]]: "Create partition",
  [SidePanelViews.CREATE_RAID[1]]: "Create raid",
  [SidePanelViews.CREATE_VOLUME_GROUP[1]]: "Create volume group",
  [SidePanelViews.DELETE_DISK[1]]: "Delete disk",
  [SidePanelViews.DELETE_FILESYSTEM[1]]: "Delete filesystem",
  [SidePanelViews.DELETE_SPECIAL_FILESYSTEM[1]]: "Delete special filesystem",
  [SidePanelViews.DeleteTag[1]]: "Delete tag",
  [SidePanelViews.DELETE_VOLUME_GROUP[1]]: "Delete volume group",
  [SidePanelViews.EDIT_DISK[1]]: "Edit disk",
  [SidePanelViews.EDIT_PARTITION[1]]: "Edit partition",
  [SidePanelViews.EDIT_PHYSICAL[1]]: "Edit physical",
  [SidePanelViews.MARK_CONNECTED[1]]: "Mark as connected",
  [SidePanelViews.MARK_DISCONNECTED[1]]: "Mark as disconnected",
  [SidePanelViews.REMOVE_PARTITION[1]]: "Remove partition",
  [SidePanelViews.REMOVE_PHYSICAL[1]]: "Remove physical",
  [SidePanelViews.SET_BOOT_DISK[1]]: "Set boot disk",
  [SidePanelViews.UNMOUNT_FILESYSTEM[1]]: "Unmount filesystem",
  [SidePanelViews.UPDATE_DATASTORE[1]]: "Update datastore",
  [SidePanelViews.UpdateTag[1]]: "Update Tag",
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
