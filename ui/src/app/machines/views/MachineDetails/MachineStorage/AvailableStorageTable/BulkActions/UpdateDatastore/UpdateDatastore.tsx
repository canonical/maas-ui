import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import UpdateDatastoreFields from "./UpdateDatastoreFields";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import { isDatastore, splitDiskPartitionIds } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

export type UpdateDatastoreValues = {
  datastore: number;
};

type Props = {
  closeForm: () => void;
  selected: (Disk | Partition)[];
  systemId: Machine["system_id"];
};

const UpdateDatastoreSchema = Yup.object().shape({
  datastore: Yup.number().required("Datastore is required"),
});

export const UpdateDatastore = ({
  closeForm,
  selected,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "updatingVmfsDatastore",
    "updateVmfsDatastore",
    () => closeForm()
  );

  if (machine && "disks" in machine) {
    const datastores = machine.disks.filter((disk) =>
      isDatastore(disk.filesystem)
    );

    if (datastores.length === 0) {
      // Close the form if the last remaining datastore was deleted after the
      // form had already been opened.
      closeForm();
      return null;
    }

    return (
      <FormCard sidebar={false}>
        <FormikForm
          allowUnchanged
          buttons={FormCardButtons}
          cleanup={machineActions.cleanup}
          errors={errors}
          initialValues={{
            datastore: datastores[0].id,
          }}
          onCancel={closeForm}
          onSaveAnalytics={{
            action: "Update datastore",
            category: "Machine storage",
            label: "Add to datastore",
          }}
          onSubmit={(values: UpdateDatastoreValues) => {
            const [blockDeviceIds, partitionIds] = splitDiskPartitionIds(
              selected
            );
            const params = {
              systemId,
              vmfsDatastoreId: values.datastore,
              ...(blockDeviceIds.length > 0 && { blockDeviceIds }),
              ...(partitionIds.length > 0 && { partitionIds }),
            };
            dispatch(machineActions.updateVmfsDatastore(params));
          }}
          saved={saved}
          saving={saving}
          submitLabel="Add to datastore"
          validationSchema={UpdateDatastoreSchema}
        >
          <UpdateDatastoreFields
            datastores={datastores}
            storageDevices={selected}
          />
        </FormikForm>
      </FormCard>
    );
  }
  return null;
};

export default UpdateDatastore;
