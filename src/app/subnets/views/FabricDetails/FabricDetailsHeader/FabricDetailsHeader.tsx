import { Button } from "@canonical/react-components";
import { useSelector } from "react-redux";

import FabricDeleteForm from "./FabricDeleteForm";
import { FabricDetailsViews } from "./constants";

import SectionHeader from "app/base/components/SectionHeader";
import { useSidePanel } from "app/base/side-panel-context";
import authSelectors from "app/store/auth/selectors";
import type { Fabric } from "app/store/fabric/types";

type Props = {
  fabric: Fabric;
};

const FabricDetailsHeader = ({ fabric }: Props): JSX.Element => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
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
      sidePanelContent={
        sidePanelContent &&
        sidePanelContent.view === FabricDetailsViews.DELETE_FABRIC ? (
          <FabricDeleteForm
            closeForm={() => setSidePanelContent(null)}
            id={fabric.id}
          />
        ) : null
      }
      sidePanelTitle="Delete fabric"
      title={fabric.name}
    />
  );
};

export default FabricDetailsHeader;
