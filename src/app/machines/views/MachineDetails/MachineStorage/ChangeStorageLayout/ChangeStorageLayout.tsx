import { Icon } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import FormikForm from "@/app/base/components/FormikForm";
import type { ClearSidePanelContent, EmptyObject } from "@/app/base/types";
import { useMachineDetailsForm } from "@/app/machines/hooks";
import { actions as machineActions } from "@/app/store/machine";
import type { Machine, StorageLayoutOption } from "@/app/store/machine/types";
import type { MachineEventErrors } from "@/app/store/machine/types/base";
import { StorageLayout } from "@/app/store/types/enum";
import { isVMWareLayout } from "@/app/store/utils";

type Props = {
  systemId: Machine["system_id"];
  clearSidePanelContent: ClearSidePanelContent;
  selectedLayout: StorageLayoutOption;
};

export const ChangeStorageLayout = ({
  systemId,
  clearSidePanelContent,
  selectedLayout,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "applyingStorageLayout",
    "applyStorageLayout"
  );

  return (
    <FormikForm<EmptyObject, MachineEventErrors>
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={clearSidePanelContent}
      onSaveAnalytics={{
        action: `Change storage layout${
          selectedLayout ? ` to ${selectedLayout?.sentenceLabel}` : ""
        }`,
        category: "Machine storage",
        label: "Change storage layout",
      }}
      onSubmit={() => {
        dispatch(machineActions.cleanup());
        dispatch(
          machineActions.applyStorageLayout({
            systemId,
            storageLayout: selectedLayout.value,
          })
        );
        clearSidePanelContent();
      }}
      saved={saved}
      saving={saving}
      submitAppearance="negative"
      submitLabel="Change storage layout"
    >
      <div className="u-flex">
        <p className="u-nudge-right">
          <Icon name="warning" />
        </p>
        <div className="u-nudge-right">
          <p className="u-no-max-width u-sv1">
            <strong>
              Are you sure you want to change the storage layout to{" "}
              {selectedLayout.sentenceLabel}?
            </strong>
            <br />
            Any changes done already will be lost.
            <br />
            {selectedLayout.value === StorageLayout.BLANK && (
              <>
                Used disks will be returned to available, and any volume groups,
                raid sets, caches, and filesystems removed.
                <br />
              </>
            )}
            {isVMWareLayout(selectedLayout.value) && (
              <>
                This layout allows only for the deployment of{" "}
                <strong>VMware ESXi</strong> images.
                <br />
              </>
            )}
            The storage layout will be applied to a node when it is deployed.
          </p>
        </div>
      </div>
    </FormikForm>
  );
};

export default ChangeStorageLayout;
