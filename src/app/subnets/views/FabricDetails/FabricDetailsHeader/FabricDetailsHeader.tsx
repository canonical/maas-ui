import { Button } from "@canonical/react-components";

import { FabricDetailsSidePanelViews } from "./constants";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import SectionHeader from "@/app/base/components/SectionHeader";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import type { Fabric } from "@/app/store/fabric/types";

type Props = {
  fabric: Fabric;
  setSidePanelContent: SetSidePanelContent;
};

const FabricDetailsHeader = ({
  fabric,
  setSidePanelContent,
}: Props): React.ReactElement => {
  const isSuperUser = useGetIsSuperUser();

  return (
    <SectionHeader
      buttons={
        isSuperUser.data
          ? [
              <Button
                appearance="neutral"
                onClick={() => {
                  setSidePanelContent({
                    view: FabricDetailsSidePanelViews.DELETE_FABRIC,
                  });
                }}
              >
                Delete fabric
              </Button>,
            ]
          : null
      }
      title={fabric.name}
    />
  );
};

export default FabricDetailsHeader;
