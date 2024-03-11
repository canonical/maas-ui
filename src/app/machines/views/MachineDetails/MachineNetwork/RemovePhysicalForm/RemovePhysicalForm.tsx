import React from "react";

import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useMachineDetailsForm } from "@/app/machines/hooks";
import { actions as machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import type { NetworkInterface, NetworkLink } from "@/app/store/types/node";
import {
  getLinkInterface,
  getRemoveTypeText,
  isAlias,
} from "@/app/store/utils";

interface Props {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
  close: () => void;
}

const RemovePhysicalForm: React.FC<Props> = ({
  link,
  nic,
  systemId,
  close,
}) => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { saved: deletedInterface, saving: deletingInterface } =
    useMachineDetailsForm(
      systemId,
      "deletingInterface",
      "deleteInterface",
      () => close()
    );
  const { saved: unlinkedSubnet, saving: unlinkingSubnet } =
    useMachineDetailsForm(systemId, "unlinkingSubnet", "unlinkSubnet", () =>
      close()
    );
  if (machine && link && !nic) {
    [nic] = getLinkInterface(machine, link);
  }
  if (!machine || !nic) {
    return null;
  }

  const removeTypeText = getRemoveTypeText(machine, nic, link);
  const isAnAlias = isAlias(machine, link);

  return (
    <ModelActionForm
      initialValues={{}}
      message={<>Are you sure you want to remove this {removeTypeText}?</>}
      modelType={removeTypeText || ""}
      onCancel={close}
      onSaveAnalytics={{
        action: `Remove ${removeTypeText}`,
        category: "Machine network",
        label: "Remove",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        if (isAnAlias) {
          if (nic?.id && link?.id) {
            dispatch(
              machineActions.unlinkSubnet({
                interfaceId: nic?.id,
                linkId: link?.id,
                systemId: machine.system_id,
              })
            );
          }
        } else if (nic?.id) {
          dispatch(
            machineActions.deleteInterface({
              interfaceId: nic?.id,
              systemId: machine.system_id,
            })
          );
        }
      }}
      onSuccess={close}
      saved={deletedInterface || unlinkedSubnet}
      saving={deletingInterface || unlinkingSubnet}
      submitLabel="Remove"
    />
  );
};

export default RemovePhysicalForm;
