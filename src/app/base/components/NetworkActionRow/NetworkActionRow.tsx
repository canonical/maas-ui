import type { ReactNode } from "react";

import { Button, Col, List, Row, Tooltip } from "@canonical/react-components";
import { useLocation } from "react-router-dom";

import { ExpandedState } from "../NodeNetworkTab/NodeNetworkTab";

import type {
  Selected,
  SetSelected,
} from "@/app/base/components/node/networking/types";
import { useIsAllNetworkingDisabled } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { DeviceSidePanelViews } from "@/app/devices/constants";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { Node } from "@/app/store/types/node";

type Action = {
  disabled: [boolean, string?][];
  label: string;
  state: ExpandedState;
};

type Props = {
  extraActions?: Action[];
  node: Node;
  rightContent?: ReactNode;
  selected?: Selected[];
  setSelected?: SetSelected;
};

export const NETWORK_DISABLED_MESSAGE =
  "Network can't be modified for this machine.";

const NetworkActionRow = ({
  extraActions,
  node,
  rightContent,
  selected,
  setSelected,
}: Props): React.ReactElement | null => {
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(node);
  const { setSidePanelContent, setSidePanelSize } = useSidePanel();
  const { pathname } = useLocation();
  const isMachinesPage = pathname.startsWith("/machine");

  const actions: Action[] = [
    {
      disabled: [[isAllNetworkingDisabled, NETWORK_DISABLED_MESSAGE]],
      label: "Add interface",
      state: ExpandedState.ADD_PHYSICAL,
    },
    ...(extraActions || []),
  ];

  const handleButtonClick = (state: ExpandedState) => {
    const expandedStateMap: Partial<Record<ExpandedState, () => void>> = {
      [ExpandedState.ADD_PHYSICAL]: isMachinesPage
        ? () =>
            setSidePanelContent({
              view: MachineSidePanelViews.ADD_INTERFACE,
              extras: { systemId: node.system_id },
            })
        : () =>
            setSidePanelContent({ view: DeviceSidePanelViews.ADD_INTERFACE }),
      [ExpandedState.ADD_BOND]: () => {
        setSidePanelContent({
          view: MachineSidePanelViews.ADD_BOND,
          extras: { systemId: node.system_id, selected: selected, setSelected },
        });
        setSidePanelSize("large");
      },
      [ExpandedState.ADD_BRIDGE]: () => {
        setSidePanelContent({
          view: MachineSidePanelViews.ADD_BRIDGE,
          extras: { systemId: node.system_id, selected: selected, setSelected },
        });
        setSidePanelSize("large");
      },
    };
    return expandedStateMap[state]?.();
  };

  const buttons = actions.map((item) => {
    // Check if there is any reason to disable the button.
    const [disabled, tooltip] =
      item.disabled.find(([disabled]) => disabled) || [];
    const button = (
      <Button
        data-testid={item.state}
        disabled={disabled}
        onClick={() => handleButtonClick(item.state)}
      >
        {item.label}
      </Button>
    );
    // Display a tooltip if the disabled item provided a message.
    if (tooltip) {
      return (
        <Tooltip data-testid={`${item.state}-tooltip`} message={tooltip}>
          {button}
        </Tooltip>
      );
    }
    return button;
  });

  return (
    <Row>
      <Col size={8}>
        <List className="u-no-margin--bottom" inline items={buttons} />
      </Col>
      <Col className="u-align--right" size={4}>
        {rightContent}
      </Col>
    </Row>
  );
};

export default NetworkActionRow;
