import type { ReactElement } from "react";
import { useCallback } from "react";

import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import DiscoveryAddForm from "@/app/networkDiscovery/views/DiscoveryAddForm";
import DiscoveryDeleteForm from "@/app/networkDiscovery/views/DiscoveryDeleteForm";
import ClearAllForm from "@/app/networkDiscovery/views/NetworkDiscoveryHeader/ClearAllForm";
import { NetworkDiscoverySidePanelViews } from "@/app/networkDiscovery/views/constants";

type Props = SidePanelContentTypes & {};

const NetworkForm = ({
  sidePanelContent,
  setSidePanelContent,
}: Props): ReactElement | null => {
  const clearSidePanelContent = useCallback(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  if (!sidePanelContent) return null;
  const discovery =
    sidePanelContent.extras && "discovery" in sidePanelContent.extras
      ? sidePanelContent.extras.discovery
      : null;

  switch (sidePanelContent.view) {
    case NetworkDiscoverySidePanelViews.ADD_DISCOVERY: {
      if (!discovery) return null;
      return (
        <DiscoveryAddForm
          discovery={discovery}
          onClose={clearSidePanelContent}
        />
      );
    }
    case NetworkDiscoverySidePanelViews.CLEAR_ALL_DISCOVERIES:
      return <ClearAllForm closeForm={clearSidePanelContent} />;
    case NetworkDiscoverySidePanelViews.DELETE_DISCOVERY: {
      if (!discovery) return null;
      return (
        <DiscoveryDeleteForm
          discovery={discovery}
          onClose={clearSidePanelContent}
        />
      );
    }
    default:
      return null;
  }
};

export default NetworkForm;
