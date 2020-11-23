import React, { useEffect, useState } from "react";

import { ContextualMenu, Icon } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";

import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type StorageLayoutOption = {
  label: string;
  sentenceLabel: string;
  value: string;
};

type Props = { id: Machine["system_id"] };

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

export const ChangeStorageLayout = ({ id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [
    selectedLayout,
    setSelectedLayout,
  ] = useState<StorageLayoutOption | null>(null);
  const { applyingStorageLayout } = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, id)
  );
  const previousApplyingStorageLayout = usePrevious(applyingStorageLayout);
  const saved = !applyingStorageLayout && previousApplyingStorageLayout;

  // Close the form when storage layout has successfully changed.
  // TODO: Check for machine-specific error, in which case keep form open.
  // https://github.com/canonical-web-and-design/maas-ui/issues/1842
  useEffect(() => {
    if (saved) {
      setSelectedLayout(null);
    }
  }, [saved]);

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
          dispatch(machineActions.applyStorageLayout(id, selectedLayout.value));
        }}
        saved={saved}
        saving={applyingStorageLayout}
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
