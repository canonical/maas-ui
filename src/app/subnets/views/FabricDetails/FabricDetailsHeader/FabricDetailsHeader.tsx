import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { FabricDetailsViews } from "./constants";

import SectionHeader from "app/base/components/SectionHeader";
import type { SetSidePanelContent } from "app/base/side-panel-context";
import authSelectors from "app/store/auth/selectors";
import type { Fabric } from "app/store/fabric/types";

type Props = {
  fabric: Fabric;
  setSidePanelContent: SetSidePanelContent;
};

const FabricDetailsHeader = ({
  fabric,
  setSidePanelContent,
}: Props): JSX.Element => {
  const isAdmin = useSelector(authSelectors.isAdmin);

  return (
    <SectionHeader
      buttons={
        isAdmin
          ? [
              <Button
                appearance="neutral"
                onClick={() =>
                  setSidePanelContent({
                    view: FabricDetailsViews.DELETE_FABRIC,
                  })
                }
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
