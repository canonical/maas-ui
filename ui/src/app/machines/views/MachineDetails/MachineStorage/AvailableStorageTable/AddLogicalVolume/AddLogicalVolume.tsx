import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import AddLogicalVolumeFields from "../AddLogicalVolumeFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
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

const AddLogicalVolumeSchema = Yup.object().shape({
  fstype: Yup.string(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string().when("filesystemType", {
    is: (val) => !!val,
    then: Yup.string()
      .matches(/^\//, "Mount point must start with /")
      .required("Mount point is required if filesystem type is defined"),
  }),
  name: Yup.string().required("Name is required"),
  size: Yup.number()
    .required("Size is required")
    .when("unit", {
      is: "MB",
      then: Yup.number().min(5, "Logical volume must be at least 5MB"),
      otherwise: Yup.number().min(0, "Size must greater than 0"),
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

  if (machine && "supported_filesystems" in machine) {
    const filesystemOptions = machine.supported_filesystems.map(
      (filesystem) => ({
        label: filesystem.ui,
        value: filesystem.key,
      })
    );
    const initialName = `lv${machine.disks.reduce(
      (sum, d) => (d.parent?.id === disk.id ? sum + 1 : sum),
      0
    )}`;

    return (
      <FormikForm
        buttons={FormCardButtons}
        cleanup={machineActions.cleanup}
        errors={errors}
        initialValues={{
          fstype: "",
          mountOptions: "",
          mountPoint: "",
          name: initialName,
          size: "",
          tags: [],
          unit: "GB",
        }}
        onCancel={closeExpanded}
        onSaveAnalytics={{
          action: "Add logical volume",
          category: "Machine storage",
          label: "Add logical volume",
        }}
        onSubmit={(values: AddLogicalVolumeValues) => {
          const {
            fstype,
            mountOptions,
            mountPoint,
            name,
            size,
            tags,
            unit,
          } = values;
          // Convert size into bytes before dispatching action
          const convertedSize = formatBytes(size, unit, { convertTo: "B" })
            ?.value;
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
        saved={saved}
        saving={saving}
        submitLabel="Add logical volume"
        validationSchema={AddLogicalVolumeSchema}
      >
        <AddLogicalVolumeFields filesystemOptions={filesystemOptions} />
      </FormikForm>
    );
  }
  return null;
};

export default AddLogicalVolume;
