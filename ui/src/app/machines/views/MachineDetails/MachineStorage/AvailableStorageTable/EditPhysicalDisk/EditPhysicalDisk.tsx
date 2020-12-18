import { useDispatch } from "react-redux";
import * as Yup from "yup";

import EditPhysicalDiskFields from "./EditPhysicalDiskFields";

import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import type { Disk, Machine } from "app/store/machine/types";

export type EditPhysicalDiskValues = {
  tags: string[];
};

type Props = {
  closeExpanded: () => void;
  disk: Disk;
  systemId: Machine["system_id"];
};

const EditPhysicalDiskSchema = Yup.object().shape({
  tags: Yup.array().of(Yup.string()),
});

export const EditPhysicalDisk = ({
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
        tags: disk.tags || [],
      }}
      onCancel={closeExpanded}
      onSaveAnalytics={{
        action: "Edit physical disk",
        category: "Machine storage",
        label: "Save",
      }}
      onSubmit={(values: EditPhysicalDiskValues) => {
        const { tags } = values;
        const params = {
          blockId: disk.id,
          systemId,
          tags,
        };

        dispatch(machineActions.updateDisk(params));
      }}
      saved={saved}
      saving={saving}
      submitLabel="Save"
      validationSchema={EditPhysicalDiskSchema}
    >
      <EditPhysicalDiskFields disk={disk} />
    </FormikForm>
  );
};

export default EditPhysicalDisk;
