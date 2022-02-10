import { Icon, Tooltip } from "@canonical/react-components";

import Definition from "app/base/components/Definition";
import SpaceLink from "app/base/components/SpaceLink";
import type { Space, SpaceMeta } from "app/store/space/types";
import { breakLines, isId, unindentString } from "app/utils";

type Props = {
  spaceId?: Space[SpaceMeta.PK] | null;
};

const formatTooltip = (message: string) => breakLines(unindentString(message));

const SubnetSummary = ({ spaceId }: Props): JSX.Element | null => {
  return (
    <Definition label="Space">
      <>
        <SpaceLink id={spaceId} />
        {isId(spaceId) ? null : (
          <Tooltip
            className="u-nudge-right--small"
            message={formatTooltip(
              `This subnet does not belong to a space. MAAS integrations require
              a space in order to determine the purpose of a network.`
            )}
            position="btm-right"
          >
            <Icon data-testid="no-space" name="warning" />
          </Tooltip>
        )}
      </>
    </Definition>
  );
};

export default SubnetSummary;
