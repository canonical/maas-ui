import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import EditLogicalVolumeFields from "../EditLogicalVolumeFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

export type EditLogicalVolumeValues = {
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

const EditLogicalVolumeSchema = Yup.object().shape({
  fstype: Yup.string(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string().when("fstype", {
    is: (val: EditLogicalVolumeValues["fstype"]) => Boolean(val),
    then: Yup.string()
      .matches(/^\//, "Mount point must start with /")
      .required("Mount point is required if filesystem type is defined"),
  }),
  tags: Yup.array().of(Yup.string()),
});

export const EditLogicalVolume = ({
  closeExpanded,
  disk,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "updatingDisk",
    "updateDisk",
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

    return (
      <FormikForm
        buttons={FormCardButtons}
        cleanup={machineActions.cleanup}
        errors={errors}
        initialValues={{
          fstype: "",
          mountOptions: "",
          mountPoint: "",
          tags: disk.tags || [],
        }}
        onCancel={closeExpanded}
        onSaveAnalytics={{
          action: "Edit logical volume",
          category: "Machine storage",
          label: "Edit logical volume",
        }}
        onSubmit={(values: EditLogicalVolumeValues) => {
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
        submitLabel="Edit logical volume"
        validationSchema={EditLogicalVolumeSchema}
      >
        <EditLogicalVolumeFields
          disk={disk}
          filesystemOptions={filesystemOptions}
        />
      </FormikForm>
    );
  }
  return null;
};

export default EditLogicalVolume;
