import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import EditPartitionFields from "../EditPartitionFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

export type EditPartitionValues = {
  fstype?: string;
  mountOptions?: string;
  mountPoint?: string;
};

type Props = {
  closeExpanded: () => void;
  disk: Disk;
  partition: Partition;
  systemId: Machine["system_id"];
};

const EditPartitionSchema = Yup.object().shape({
  fstype: Yup.string(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string().when("fstype", {
    is: (val) => Boolean(val),
    then: Yup.string()
      .matches(/^\//, "Mount point must start with /")
      .required("Mount point is required if filesystem type is defined"),
  }),
});

export const EditPartition = ({
  closeExpanded,
  disk,
  partition,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "updatingFilesystem",
    "updateFilesystem",
    () => closeExpanded()
  );
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (machine && "supported_filesystems" in machine) {
    const filesystemOptions = machine.supported_filesystems.map(
      (filesystem) => ({
        label: filesystem.ui,
        value: filesystem.key,
      })
    );
    const fs = partition.filesystem;

    return (
      <FormikForm
        buttons={FormCardButtons}
        cleanup={machineActions.cleanup}
        errors={errors}
        initialValues={{
          fstype: fs?.fstype || "",
          mountOptions: fs?.mount_options || "",
          mountPoint: fs?.mount_point || "",
        }}
        onCancel={closeExpanded}
        onSaveAnalytics={{
          action: "Edit partition",
          category: "Machine storage",
          label: "Edit partition",
        }}
        onSubmit={(values: EditPartitionValues) => {
          const { fstype, mountOptions, mountPoint } = values;
          const params = {
            blockId: disk.id,
            fstype,
            partitionId: partition.id,
            systemId: machine.system_id,
            ...(fstype && mountOptions && { mountOptions }),
            ...(fstype && mountPoint && { mountPoint }),
          };

          dispatch(machineActions.updateFilesystem(params));
        }}
        saved={saved}
        saving={saving}
        submitLabel="Edit partition"
        validationSchema={EditPartitionSchema}
      >
        <EditPartitionFields
          filesystemOptions={filesystemOptions}
          partition={partition}
        />
      </FormikForm>
    );
  }
  return null;
};

export default EditPartition;
