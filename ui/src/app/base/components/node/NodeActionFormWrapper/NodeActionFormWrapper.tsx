import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@canonical/react-components";

import { useCycled, useScrollOnRender } from "app/base/hooks";
import type { ClearHeaderContent } from "app/base/types";
import type { Node } from "app/store/types/node";
import { NodeActions } from "app/store/types/node";
import { canOpenActionForm } from "app/store/utils";

const getErrorSentence = (
  action: NodeActions,
  nodeType: string,
  count: number
) => {
  const nodeString = `${count} ${nodeType}${count === 1 ? "" : "s"}`;

  switch (action) {
    case NodeActions.ABORT:
      return `${nodeString} cannot abort action`;
    case NodeActions.ACQUIRE:
      return `${nodeString} cannot be allocated`;
    case NodeActions.CLONE:
      return `${nodeString} cannot be cloned to`;
    case NodeActions.COMMISSION:
      return `${nodeString} cannot be commissioned`;
    case NodeActions.DELETE:
      return `${nodeString} cannot be deleted`;
    case NodeActions.DEPLOY:
      return `${nodeString} cannot be deployed`;
    case NodeActions.EXIT_RESCUE_MODE:
      return `${nodeString} cannot exit rescue mode`;
    case NodeActions.IMPORT_IMAGES:
      return `${nodeString} cannot import images`;
    case NodeActions.LOCK:
      return `${nodeString} cannot be locked`;
    case NodeActions.MARK_BROKEN:
      return `${nodeString} cannot be marked broken`;
    case NodeActions.MARK_FIXED:
      return `${nodeString} cannot be marked fixed`;
    case NodeActions.OFF:
      return `${nodeString} cannot be powered off`;
    case NodeActions.ON:
      return `${nodeString} cannot be powered on`;
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return `Cannot override failed tests on ${nodeString}`;
    case NodeActions.RELEASE:
      return `${nodeString} cannot be released`;
    case NodeActions.RESCUE_MODE:
      return `${nodeString} cannot be put in rescue mode`;
    case NodeActions.SET_POOL:
      return `Cannot set pool of ${nodeString}`;
    case NodeActions.SET_ZONE:
      return `Cannot set zone of ${nodeString}`;
    case NodeActions.TAG:
      return `${nodeString} cannot be tagged`;
    case NodeActions.TEST:
      return `${nodeString} cannot be tested`;
    case NodeActions.UNLOCK:
      return `${nodeString} cannot be unlocked`;
    default:
      return `${nodeString} cannot perform action`;
  }
};

type Props = {
  action: NodeActions;
  children: ReactNode;
  clearHeaderContent: ClearHeaderContent;
  nodes: Node[];
  nodeType: string;
  processingCount: number;
  onUpdateSelected: (nodeIDs: Node["system_id"][]) => void;
  viewingDetails: boolean;
};

export const NodeActionFormWrapper = ({
  action,
  children,
  clearHeaderContent,
  nodes,
  nodeType,
  onUpdateSelected,
  processingCount,
  viewingDetails,
}: Props): JSX.Element => {
  const onRenderRef = useScrollOnRender<HTMLDivElement>();
  const [actionStarted] = useCycled(processingCount !== 0);
  const actionableNodeIDs = nodes.reduce<Node["system_id"][]>(
    (nodeIDs, node) =>
      canOpenActionForm(node, action) ? [...nodeIDs, node.system_id] : nodeIDs,
    []
  );
  // Show a warning if not all the selected nodes can perform the selected
  // action, unless an action has already been started in which case we want to
  // maintain the form being rendered.
  const showWarning =
    !viewingDetails &&
    !actionStarted &&
    actionableNodeIDs.length !== nodes.length;

  useEffect(() => {
    if (nodes.length === 0) {
      // All the nodes were deselected so close the form.
      clearHeaderContent();
    }
  }, [clearHeaderContent, nodes.length]);

  return (
    <div ref={onRenderRef}>
      {showWarning ? (
        <p data-testid="node-action-warning">
          <i className="p-icon--warning" />
          <span className="u-nudge-right--small">
            {getErrorSentence(
              action,
              nodeType,
              nodes.length - actionableNodeIDs.length
            )}
            . To proceed,{" "}
            <Button
              appearance="link"
              className="u-no-margin--bottom"
              data-testid="on-update-selected"
              onClick={() => onUpdateSelected(actionableNodeIDs)}
            >
              update your selection
            </Button>
            .
          </span>
        </p>
      ) : (
        children
      )}
    </div>
  );
};

export default NodeActionFormWrapper;
