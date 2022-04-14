import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddLogicalVolumeFields from "./AddLogicalVolumeFields";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import { MIN_PARTITION_SIZE } from "app/store/machine/constants";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import { isMachineDetails } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import type { Disk } from "app/store/types/node";
import { formatBytes } from "app/utils";

export type AddLogicalVolumeValues = {
  fstype?: string;
  mountOptions?: string;
  mountPoint?: string;
  name: string;
  size: number;
  tags: string[];
  unit: string;
};

type Props = {
  closeExpanded: () => void;
  disk: Disk;
  systemId: Machine["system_id"];
};

const generateSchema = (availableSize: number) =>
  Yup.object().shape({
    fstype: Yup.string(),
    mountOptions: Yup.string(),
    mountPoint: Yup.string().when("fstype", {
      is: (val: AddLogicalVolumeValues["fstype"]) =>
        Boolean(val) && val !== "swap",
      then: Yup.string().matches(/^\//, "Mount point must start with /"),
    }),
    name: Yup.string().required("Name is required"),
    size: Yup.number()
      .required("Size is required")
      .min(0, "Size must be greater than 0")
      .test("enoughSpace", "Not enough space", function test() {
        const values: AddLogicalVolumeValues = this.parent;
        const { size, unit } = values;
        const sizeInBytes = formatBytes(size, unit, {
          convertTo: "B",
          roundFunc: "floor",
        }).value;

        if (sizeInBytes < MIN_PARTITION_SIZE) {
          const min = formatBytes(MIN_PARTITION_SIZE, "B", {
            convertTo: unit,
            roundFunc: "floor",
          }).value;
          return this.createError({
            message: `At least ${min}${unit} is required to add a logical volume`,
            path: "size",
          });
        }

        if (sizeInBytes > availableSize) {
          const max = formatBytes(availableSize, "B", {
            convertTo: unit,
            roundFunc: "floor",
          }).value;
          return this.createError({
            message: `Only ${max}${unit} available in this volume group`,
            path: "size",
          });
        }

        return true;
      }),
    tags: Yup.array().of(Yup.string()),
    unit: Yup.string().required(),
  });

export const AddLogicalVolume = ({
  closeExpanded,
  disk,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingLogicalVolume",
    "createLogicalVolume",
    () => closeExpanded()
  );
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );

  if (isMachineDetails(machine)) {
    const initialName = `lv${machine.disks.reduce(
      (sum, d) => (d.parent?.id === disk.id ? sum + 1 : sum),
      0
    )}`;
    const AddLogicalVolumeSchema = generateSchema(disk.available_size);

    return (
      <Formik
        initialValues={{
          fstype: "",
          mountOptions: "",
          mountPoint: "",
          name: initialName,
          size: formatBytes(disk.available_size, "B", {
            convertTo: "GB",
            roundFunc: "floor",
          }).value,
          tags: [],
          unit: "GB",
        }}
        onSubmit={(values: AddLogicalVolumeValues) => {
          const { fstype, mountOptions, mountPoint, name, size, tags, unit } =
            values;
          // Convert size into bytes before dispatching action
          const convertedSize = formatBytes(size, unit, {
            convertTo: "B",
          })?.value;
          const params = {
            name,
            size: convertedSize,
            systemId: machine.system_id,
            volumeGroupId: disk.id,
            ...(fstype && { fstype }),
            ...(fstype && mountOptions && { mountOptions }),
            ...(fstype && mountPoint && { mountPoint }),
            ...(tags.length > 0 && { tags }),
          };

          dispatch(machineActions.createLogicalVolume(params));
        }}
        validationSchema={AddLogicalVolumeSchema}
      >
        <FormikFormContent<AddLogicalVolumeValues, MachineEventErrors>
          allowUnchanged
          cleanup={machineActions.cleanup}
          errors={errors}
          onCancel={closeExpanded}
          onSaveAnalytics={{
            action: "Add logical volume",
            category: "Machine storage",
            label: "Add logical volume",
          }}
          saved={saved}
          saving={saving}
          submitLabel="Add logical volume"
        >
          <AddLogicalVolumeFields systemId={systemId} />
        </FormikFormContent>
      </Formik>
    );
  }
  return null;
};

export default AddLogicalVolume;
