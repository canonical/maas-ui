import type { ReactNode } from "react";

import { Button, Col, List, Row, Tooltip } from "@canonical/react-components";

import type { Expanded, SetExpanded } from "../NodeNetworkTab/NodeNetworkTab";
import { ExpandedState } from "../NodeNetworkTab/NodeNetworkTab";

import { useIsAllNetworkingDisabled } from "app/base/hooks";
import type { Node } from "app/store/types/node";

type Action = {
  disabled: [boolean, string?][];
  label: string;
  state: ExpandedState;
};

type Props = {
  expanded: Expanded | null;
  extraActions?: Action[];
  node: Node;
  rightContent?: ReactNode;
  setExpanded: SetExpanded;
};

export const NETWORK_DISABLED_MESSAGE =
  "Network can't be modified for this machine.";

const NetworkActions = ({
  expanded,
  extraActions,
  node,
  rightContent,
  setExpanded,
}: Props): JSX.Element | null => {
  const isAllNetworkingDisabled = useIsAllNetworkingDisabled(node);

  const actions: Action[] = [
    {
      disabled: [
        [isAllNetworkingDisabled, NETWORK_DISABLED_MESSAGE],
        // Disable the button when the form is visible.
        [expanded?.content === ExpandedState.ADD_PHYSICAL],
      ],
      label: "Add interface",
      state: ExpandedState.ADD_PHYSICAL,
    },
    ...(extraActions || []),
  ];

  const buttons = actions.map((item) => {
    // Check if there is any reason to disable the button.
    const [disabled, tooltip] =
      item.disabled.find(([disabled]) => disabled) || [];
    const button = (
      <Button
        data-testid={item.state}
        disabled={disabled}
        onClick={() => {
          setExpanded({ content: item.state });
        }}
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

export default NetworkActions;
