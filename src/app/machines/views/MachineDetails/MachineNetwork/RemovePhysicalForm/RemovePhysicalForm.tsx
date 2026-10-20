import type { ReactElement } from "react";

import { useDispatch, useSelector } from "react-redux";

import ModelActionForm from "@/app/base/components/ModelActionForm";
import { useModal } from "@/app/base/modal-context";
import { useMachineDetailsForm } from "@/app/machines/hooks";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import type { NetworkInterface, NetworkLink } from "@/app/store/types/node";
import {
  getLinkInterface,
  getRemoveTypeText,
  isAlias,
} from "@/app/store/utils";

type RemovePhysicalProps = {
  link?: NetworkLink | null;
  nic?: NetworkInterface | null;
  systemId: Machine["system_id"];
};

const RemovePhysicalForm = ({
  link,
  nic,
  systemId,
}: RemovePhysicalProps): ReactElement | null => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { saved: deletedInterface, saving: deletingInterface } =
    useMachineDetailsForm(
      systemId,
      "deletingInterface",
      "deleteInterface",
      () => {
        closeModal();
      }
    );
  const { saved: unlinkedSubnet, saving: unlinkingSubnet } =
    useMachineDetailsForm(systemId, "unlinkingSubnet", "unlinkSubnet", () => {
      closeModal();
    });
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
      onCancel={closeModal}
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
      onSuccess={closeModal}
      saved={deletedInterface || unlinkedSubnet}
      saving={deletingInterface || unlinkingSubnet}
      submitLabel="Remove"
    />
  );
};

export default RemovePhysicalForm;
