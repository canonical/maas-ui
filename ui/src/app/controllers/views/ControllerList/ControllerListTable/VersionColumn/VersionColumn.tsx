import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import TooltipButton from "app/base/components/TooltipButton";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

export const VersionColumn = ({ systemId }: Props): JSX.Element | null => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );
  const versions = controller?.versions;
  if (!versions) {
    return null;
  }
  let cohortKey = null;
  if (versions.snap_cohort) {
    // Format the key into lines of 41 characters so that it can be displayed
    // nicely in the tooltip.
    const chunks = versions.snap_cohort.match(/.{1,41}/g) || [];
    cohortKey = chunks.map((chunk) => chunk.trim()).join(" \n");
  }
  const origin = versions.origin || null;
  const cohortTooltip = cohortKey ? `Cohort key: \n${cohortKey}` : null;
  const isDeb = versions.install_type === "deb";
  return (
    <DoubleRow
      primary={
        <span data-testid="version">
          {versions.current.version ?? (
            <>
              Unknown <TooltipButton message="Less than 2.3.0" />
            </>
          )}
        </span>
      }
      primaryClassName="u-truncate"
      primaryTitle={versions.current.version}
      secondary={
        <>
          <span data-testid="origin">
            {!!origin && <>{isDeb ? "Deb" : origin} </>}
          </span>
          {!!(cohortTooltip || isDeb) && (
            <TooltipButton message={isDeb ? origin : cohortTooltip} />
          )}
        </>
      }
    />
  );
};

export default VersionColumn;
