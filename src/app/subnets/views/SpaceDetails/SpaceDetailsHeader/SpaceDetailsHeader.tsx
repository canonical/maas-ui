import { Button } from "@canonical/react-components";

import { SpaceDetailsSidePanelViews } from "../constants";

import SectionHeader from "@/app/base/components/SectionHeader";
import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import type { Space } from "@/app/store/space/types";

type Props = SidePanelContentTypes & {
  space: Space;
};

const SpaceDetailsHeader = ({
  space,
  setSidePanelContent,
  sidePanelContent,
}: Props): React.ReactElement => {
  return (
    <SectionHeader
      buttons={[
        <Button
          disabled={!!sidePanelContent}
          onClick={() => {
            setSidePanelContent({
              view: SpaceDetailsSidePanelViews.DELETE_SPACE,
            });
          }}
        >
          Delete space
        </Button>,
      ]}
      title={space.name}
    />
  );
};

export default SpaceDetailsHeader;
