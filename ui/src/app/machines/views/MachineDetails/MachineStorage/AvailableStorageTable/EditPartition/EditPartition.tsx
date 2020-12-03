import { useEffect } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import EditPartitionFields from "../EditPartitionFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
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
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { updatingFilesystem } = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, systemId)
  );
  const previousUpdatingFilesystem = usePrevious(updatingFilesystem);
  const saved = !updatingFilesystem && previousUpdatingFilesystem;

  // Close the form when partition has successfully been edited.
  // TODO: Check for machine-specific error, in which case keep form open.
  // https://github.com/canonical-web-and-design/maas-ui/issues/1968
  useEffect(() => {
    if (saved) {
      closeExpanded();
    }
  }, [closeExpanded, saved]);

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
        saving={updatingFilesystem}
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
