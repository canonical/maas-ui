import { useState } from "react";

import { ContextualMenu, Icon } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch } from "react-redux";

import FormCard from "app/base/components/FormCard";
import FormikFormContent from "app/base/components/FormikFormContent";
import type { EmptyObject } from "app/base/types";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type { Machine } from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { isVMWareLayout } from "app/store/machine/utils";
import { StorageLayout } from "app/store/types/enum";

type StorageLayoutOption = {
  label: string;
  sentenceLabel: string;
  value: StorageLayout;
};

type Props = { systemId: Machine["system_id"] };

// TODO: Once the API returns a list of allowed storage layouts for a given
// machine we should either filter this list, or add a boolean e.g. "allowable"
// to each layout.
// https://github.com/canonical-web-and-design/maas-ui/issues/3258
const storageLayoutOptions: StorageLayoutOption[][] = [
  [
    { label: "Flat", sentenceLabel: "flat", value: StorageLayout.FLAT },
    { label: "LVM", sentenceLabel: "LVM", value: StorageLayout.LVM },
    { label: "bcache", sentenceLabel: "bcache", value: StorageLayout.BCACHE },
    { label: "Custom", sentenceLabel: "custom", value: StorageLayout.CUSTOM },
  ],
  [
    {
      label: "VMFS6",
      sentenceLabel: "VMFS6",
      value: StorageLayout.VMFS6,
    },
    {
      label: "VMFS7",
      sentenceLabel: "VMFS7",
      value: StorageLayout.VMFS7,
    },
  ],
  [
    {
      label: "No storage (blank) layout",
      sentenceLabel: "blank",
      value: StorageLayout.BLANK,
    },
  ],
];

export const ChangeStorageLayout = ({ systemId }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [selectedLayout, setSelectedLayout] =
    useState<StorageLayoutOption | null>(null);
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
        toggleLabel="Change storage layout"
      />
    </div>
  ) : (
    <FormCard data-testid="confirmation-form" sidebar={false}>
      <Formik
        initialValues={{}}
        onSubmit={() => {
          dispatch(machineActions.cleanup());
          dispatch(
            machineActions.applyStorageLayout({
              systemId,
              storageLayout: selectedLayout.value,
            })
          );
        }}
      >
        <FormikFormContent<EmptyObject, MachineEventErrors>
          cleanup={machineActions.cleanup}
          errors={errors}
          onCancel={() => setSelectedLayout(null)}
          onSaveAnalytics={{
            action: `Change storage layout${
              selectedLayout ? ` to ${selectedLayout?.sentenceLabel}` : ""
            }`,
            category: "Machine storage",
            label: "Change storage layout",
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
                    Used disks will be returned to available, and any volume
                    groups, raid sets, caches, and filesystems removed.
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
                The storage layout will be applied to a node when it is
                deployed.
              </p>
            </div>
          </div>
        </FormikFormContent>
      </Formik>
    </FormCard>
  );
};

export default ChangeStorageLayout;
