import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddPartitionFields from "../AddPartitionFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { formatBytes } from "app/utils";

export type AddPartitionValues = {
  filesystemType?: string;
  mountOptions?: string;
  mountPoint?: string;
  partitionSize: number;
  unit: string;
};

type Props = {
  closeExpanded: () => void;
  disk: Disk;
  systemId: Machine["system_id"];
};

const generateSchema = (availableSize: number) =>
  Yup.object().shape({
    filesystemType: Yup.string(),
    mountOptions: Yup.string(),
    mountPoint: Yup.string().when("filesystemType", {
      is: (val: AddPartitionValues["filesystemType"]) => !!val,
      then: Yup.string()
        .matches(/^\//, "Mount point must start with /")
        .required("Mount point is required if filesystem type is defined"),
    }),
    partitionSize: Yup.number()
      .required("Size is required")
      .min(0, "Size must be greater than 0")
      .test("enoughSpace", "Not enough space", function test() {
        const values: AddPartitionValues = this.parent;
        const { partitionSize, unit } = values;
        const sizeInBytes = formatBytes(partitionSize, unit, {
          convertTo: "B",
        }).value;

        if (sizeInBytes < MIN_PARTITION_SIZE) {
          const min = formatBytes(MIN_PARTITION_SIZE, "B", {
            convertTo: unit,
          }).value;
          return this.createError({
            message: `At least ${min}${unit} is required to partition this disk`,
            path: "partitionSize",
          });
        }

        if (sizeInBytes > availableSize) {
          const max = formatBytes(availableSize, "B", {
            convertTo: unit,
          }).value;
          return this.createError({
            message: `Only ${max}${unit} available in this disk`,
            path: "partitionSize",
          });
        }

        return true;
      }),
    unit: Yup.string().required(),
  });

export const AddPartition = ({
  closeExpanded,
  disk,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingPartition",
    "createPartition",
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
    const partitionName = disk
      ? `${disk.name}-part${(disk.partitions?.length || 0) + 1}`
      : "partition";
    const AddPartitionSchema = generateSchema(disk.available_size);

    return (
      <FormikForm
        buttons={FormCardButtons}
        cleanup={machineActions.cleanup}
        errors={errors}
        initialValues={{
          filesystemType: "",
          mountOptions: "",
          mountPoint: "",
          partitionSize: "",
          unit: "GB",
        }}
        onCancel={closeExpanded}
        onSaveAnalytics={{
          action: "Add partition",
          category: "Machine storage",
          label: "Add partition",
        }}
        onSubmit={(values: AddPartitionValues) => {
          dispatch(machineActions.cleanup());
          const {
            filesystemType,
            mountOptions,
            mountPoint,
            partitionSize,
            unit,
          } = values;
          // Convert size into bytes before dispatching action
          const size = formatBytes(partitionSize, unit, { convertTo: "B" })
            ?.value;
          const params = {
            blockId: disk.id,
            partitionSize: size,
            systemId: machine.system_id,
            ...(filesystemType && { filesystemType }),
            ...(filesystemType && mountOptions && { mountOptions }),
            ...(filesystemType && mountPoint && { mountPoint }),
          };

          dispatch(machineActions.createPartition(params));
        }}
        saved={saved}
        saving={saving}
        submitLabel="Add partition"
        validationSchema={AddPartitionSchema}
      >
        <AddPartitionFields
          filesystemOptions={filesystemOptions}
          partitionName={partitionName}
        />
      </FormikForm>
    );
  }
  return null;
};

export default AddPartition;
