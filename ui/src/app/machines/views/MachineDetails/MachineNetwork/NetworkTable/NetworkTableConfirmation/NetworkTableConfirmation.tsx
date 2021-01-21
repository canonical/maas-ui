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
  }
  return <div className="u-flex--grow">{content}</div>;
};

export default NetworkTableConfirmation;
