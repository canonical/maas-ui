import { useDispatch } from "react-redux";
import * as Yup from "yup";

import EditDiskFields from "./EditDiskFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type { Disk, Machine } from "app/store/machine/types";
import { formatType } from "app/store/machine/utils";

export type EditDiskValues = {
  fstype?: string;
  mountOptions?: string;
  mountPoint?: string;
  tags: string[];
};

type Props = {
  closeExpanded: () => void;
  disk: Disk;
  systemId: Machine["system_id"];
};

const EditDiskSchema = Yup.object().shape({
  fstype: Yup.string(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string().when("fstype", {
    is: (val: EditDiskValues["fstype"]) => Boolean(val),
    then: Yup.string().matches(/^\//, "Mount point must start with /"),
  }),
  tags: Yup.array().of(Yup.string()),
});

export const EditDisk = ({
  closeExpanded,
  disk,
  systemId,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "updatingDisk",
    "updateDisk",
    () => closeExpanded()
  );

  return (
    <FormikForm
      buttons={FormCardButtons}
      cleanup={machineActions.cleanup}
      errors={errors}
      initialValues={{
        fstype: disk.filesystem?.fstype || "",
        mountOptions: disk.filesystem?.mount_options || "",
        mountPoint: disk.filesystem?.mount_point || "",
        tags: disk.tags || [],
      }}
      onCancel={closeExpanded}
      onSaveAnalytics={{
        action: `Edit ${formatType(disk, true)}`,
        category: "Machine storage",
        label: "Save",
      }}
      onSubmit={(values: EditDiskValues) => {
        const { fstype, mountOptions, mountPoint, tags } = values;
        const params = {
          blockId: disk.id,
          systemId,
          tags,
          ...(fstype && { fstype }),
          ...(fstype && mountOptions && { mountOptions }),
          ...(fstype && mountPoint && { mountPoint }),
        };

        dispatch(machineActions.updateDisk(params));
      }}
      saved={saved}
      saving={saving}
      submitLabel="Save"
      validationSchema={EditDiskSchema}
    >
      <EditDiskFields disk={disk} systemId={systemId} />
    </FormikForm>
  );
};

export default EditDisk;
