import { useState } from "react";

import { ContextualMenu, Icon } from "@canonical/react-components";
import { useDispatch } from "react-redux";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";

type StorageLayoutOption = {
  label: string;
  sentenceLabel: string;
  value: string;
};

type Props = { systemId: Machine["system_id"] };

const storageLayoutOptions: StorageLayoutOption[][] = [
  [
    { label: "Flat", sentenceLabel: "flat", value: "flat" },
    { label: "LVM", sentenceLabel: "LVM", value: "lvm" },
    { label: "bcache", sentenceLabel: "bcache", value: "bcache" },
  ],
  [{ label: "VMFS6 (VMware ESXI)", sentenceLabel: "VMFS6", value: "vmfs6" }],
  [
    {
      label: "No storage (blank) layout",
      sentenceLabel: "blank",
      value: "blank",
    },
  ],
];

export const ChangeStorageLayout = ({ systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [
    selectedLayout,
    setSelectedLayout,
  ] = useState<StorageLayoutOption | null>(null);
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "applyingStorageLayout",
    "applyStorageLayout",
    () => setSelectedLayout(null)
  );

  return !selectedLayout ? (
    <div className="u-align--right">
      <ContextualMenu
        hasToggleIcon
        links={storageLayoutOptions.map((group) =>
          group.map((option) => ({
            children: option.label,
            onClick: () => setSelectedLayout(option),
          }))
        )}
        position="right"
        toggleAppearance="neutral"
        toggleLabel="Change storage layout"
      />
    </div>
  ) : (
    <FormCard data-test="confirmation-form" sidebar={false}>
      <FormikForm
        buttons={FormCardButtons}
        cleanup={machineActions.cleanup}
        errors={errors}
        initialValues={{}}
        onCancel={() => setSelectedLayout(null)}
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
            machineActions.applyStorageLayout(systemId, selectedLayout.value)
          );
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
              {selectedLayout.value === "blank" && (
                <>
                  Used disks will be returned to available, and any volume
                  groups, raid sets, caches, and filesystems removed.
                  <br />
                </>
              )}
              {selectedLayout.value === "vmfs6" && (
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
    </FormCard>
  );
};

export default ChangeStorageLayout;
