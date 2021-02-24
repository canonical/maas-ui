import type { ReactNode } from "react";

import { useDispatch, useSelector } from "react-redux";

import ActionConfirm from "../../../ActionConfirm";
import type { Expanded, SetExpanded } from "../types";
import { ExpandedState } from "../types";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  Machine,
  NetworkInterface,
  NetworkLink,
} from "app/store/machine/types";
import {
  getLinkInterface,
  getRemoveTypeText,
  isAlias,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  expanded: Expanded | null;
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  setExpanded: SetExpanded;
  systemId: Machine["system_id"];
};

const NetworkTableConfirmation = ({
  expanded,
  link,
  nic,
  setExpanded,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  if (machine && link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  if (!machine || !nic || !expanded) {
    return null;
  }
  const removeTypeText = getRemoveTypeText(machine, nic, link);
  const isAnAlias = isAlias(machine, link);
  let content: ReactNode;
  if (expanded?.content === ExpandedState.REMOVE) {
    content = (
      <ActionConfirm
        closeExpanded={() => setExpanded(null)}
        confirmLabel="Remove"
        eventName={isAnAlias ? "unlinkSubnet" : "deleteInterface"}
        message={`Are you sure you want to remove this ${removeTypeText}?`}
        onConfirm={() => {
          dispatch(machineActions.cleanup());
          if (isAnAlias) {
            dispatch(
              machineActions.unlinkSubnet({
                interfaceId: nic?.id,
                linkId: link?.id,
                systemId: machine.system_id,
              })
            );
          } else {
            dispatch(
              machineActions.deleteInterface({
                interfaceId: nic?.id,
                systemId: machine.system_id,
              })
            );
          }
        }}
        onSaveAnalytics={{
          action: `Remove ${removeTypeText}`,
          category: "Machine network",
          label: "Remove",
        }}
        statusKey={isAnAlias ? "unlinkingSubnet" : "deletingInterface"}
        systemId={machine.system_id}
      />
    );
  } else if (
    [
      ExpandedState.MARK_CONNECTED,
      ExpandedState.MARK_DISCONNECTED,
      ExpandedState.DISCONNECTED_WARNING,
    ].includes(expanded?.content)
  ) {
    const showDisconnectedWarning =
      expanded?.content === ExpandedState.DISCONNECTED_WARNING;
    const markConnected =
      expanded?.content === ExpandedState.MARK_CONNECTED ||
      showDisconnectedWarning;
    const event = markConnected ? "connected" : "disconnected";
    const updateConnection = () => {
      dispatch(
        machineActions.updateInterface({
          interface_id: nic?.id,
          link_connected: !!markConnected,
          system_id: machine.system_id,
        })
      );
    };
    let message: ReactNode;
    if (showDisconnectedWarning) {
      message = (
        <>
          This interface is <strong>disconnected</strong>, it cannot be
          configured unless a cable is connected.
          <br />
          If this is no longer true, mark cable as connected.
        </>
      );
    } else {
      message = (
        <>
          This interface was detected as{" "}
          <strong>{nic.link_connected ? "connected" : "disconnected"}</strong>.
          Are you sure you want to mark it as {event}?
          {markConnected ? null : (
            <>
              <br />
              When the interface is disconnected, it cannot be configured.
            </>
          )}
        </>
      );
    }
    content = (
      <ActionConfirm
        closeExpanded={() => setExpanded(null)}
        confirmLabel={`Mark as ${event}`}
        eventName="updateInterface"
        message={message}
        onConfirm={updateConnection}
        onSaveAnalytics={{
          action: `Mark interface as ${event}`,
          category: "Machine network",
          label: "Update",
        }}
        statusKey="updatingInterface"
        submitAppearance={markConnected ? "positive" : "negative"}
        systemId={machine.system_id}
      />
    );
  } else if (expanded?.content === ExpandedState.ADD_ALIAS) {
    content = "Add alias.";
  } else if (expanded?.content === ExpandedState.ADD_VLAN) {
    content = "Add VLAN.";
  }
  return <div className="u-flex--grow">{content}</div>;
};

export default NetworkTableConfirmation;
