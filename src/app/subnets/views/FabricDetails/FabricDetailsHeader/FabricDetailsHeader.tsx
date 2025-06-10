import { Button } from "@canonical/react-components";

import { FabricDetailsSidePanelViews } from "./constants";

import { useGetThisUser } from "@/app/api/query/users";
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
  const user = useGetThisUser();

  return (
    <SectionHeader
      buttons={
        user.data?.is_superuser
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
