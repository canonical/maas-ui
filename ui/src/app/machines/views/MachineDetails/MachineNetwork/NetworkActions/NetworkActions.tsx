import { Button, Col, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import type { SetSelectedAction } from "../../types";
import { ExpandedState } from "../NetworkTable/types";
import type { Expanded, SetExpanded } from "../NetworkTable/types";

import { useSendAnalytics } from "app/base/hooks";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { useIsAllNetworkingDisabled } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  expanded: Expanded | null;
  setExpanded: SetExpanded;
  systemId: Machine["system_id"];
  setSelectedAction: SetSelectedAction;
};

const NetworkActions = ({
  expanded,
  setExpanded,
  setSelectedAction,
  systemId,
}: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(machine);
  const sendAnalytics = useSendAnalytics();

  if (!machine) {
    return null;
  }

  return (
    <Row>
      <Col size="8">
        <Button
          disabled={
            isAllNetworkingDisabled ||
            expanded?.content === ExpandedState.ADD_PHYSICAL
          }
          onClick={() => {
            setExpanded({ content: ExpandedState.ADD_PHYSICAL });
          }}
        >
          Add interface
        </Button>
      </Col>
      <Col className="u-align--right" size="4">
        <Button
          disabled={isAllNetworkingDisabled}
          onClick={() => {
            setSelectedAction({
              name: NodeActions.TEST,
              formProps: { applyConfiguredNetworking: true },
            });
            sendAnalytics(
              "Machine details",
              "Validate network configuration",
              "Network tab"
            );
          }}
        >
          Validate network configuration
        </Button>
      </Col>
    </Row>
  );
};

export default NetworkActions;
