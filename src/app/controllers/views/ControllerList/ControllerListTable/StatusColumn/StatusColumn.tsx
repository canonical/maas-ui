import { ExternalLink } from "@canonical/maas-react-components";
import { Icon } from "@canonical/react-components";
import { useSelector } from "react-redux";

import TooltipButton from "@/app/base/components/TooltipButton";
import ControllerStatus from "@/app/controllers/components/ControllerStatus";
import controllerSelectors from "@/app/store/controller/selectors";
import type { Controller, ControllerMeta } from "@/app/store/controller/types";
import type { RootState } from "@/app/store/root/types";

type Props = {
  readonly systemId: Controller[ControllerMeta.PK];
};

export const StatusColumn = ({
  systemId,
}: Props): React.ReactElement | null => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );

  if (!controller) {
    return null;
  }
  // Map the issue id to the type of issue.
  const issues = (controller.versions?.issues || []).map((issue) =>
    issue.replace("different-", "")
  );
  const issue = issues.length
    ? `Different ${issues.join(" and ")} detected.`
    : null;

  return issue ? (
    <span data-testid="version-error">
      <Icon name="error" />{" "}
      <TooltipButton
        message={
          <>
            {issue}
            <br />
            <ExternalLink
              className="is-on-dark"
              to="https://discourse.maas.io/t/4555"
            >
              More info
            </ExternalLink>
          </>
        }
        position="top-center"
      />
    </span>
  ) : (
    <ControllerStatus systemId={systemId} />
  );
};

export default StatusColumn;
