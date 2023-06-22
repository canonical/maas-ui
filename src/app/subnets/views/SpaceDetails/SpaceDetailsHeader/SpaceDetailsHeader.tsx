import { Button } from "@canonical/react-components";

import type { SpaceDetailsSidePanelContent } from "../constants";
import { SpaceDetailsViews } from "../constants";

import SectionHeader from "app/base/components/SectionHeader";
import type { SetSidePanelContent } from "app/base/side-panel-context";
import type { Space } from "app/store/space/types";

type Props = {
  space: Space;
  setSidePanelContent: SetSidePanelContent;
  sidePanelContent: SpaceDetailsSidePanelContent | null;
};

const SpaceDetailsHeader = ({
  space,
  setSidePanelContent,
  sidePanelContent,
}: Props): JSX.Element => {
  return (
    <SectionHeader
      buttons={[
        <Button
          disabled={!!sidePanelContent}
          onClick={() =>
            setSidePanelContent({ view: SpaceDetailsViews.DELETE_SPACE })
          }
        >
          Delete space
        </Button>,
      ]}
      title={space.name}
    />
  );
};

export default SpaceDetailsHeader;
