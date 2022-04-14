import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import UpdateDatastoreFields from "./UpdateDatastoreFields";

import FormCard from "app/base/components/FormCard";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import {
  isDatastore,
  isMachineDetails,
  splitDiskPartitionIds,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import type { Disk, Partition } from "app/store/types/node";

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

  if (isMachineDetails(machine)) {
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
        <Formik
          initialValues={{
            datastore: datastores[0].id,
          }}
          onSubmit={(values: UpdateDatastoreValues) => {
            const [blockDeviceIds, partitionIds] =
              splitDiskPartitionIds(selected);
            const params = {
              systemId,
              vmfsDatastoreId: values.datastore,
              ...(blockDeviceIds.length > 0 && { blockDeviceIds }),
              ...(partitionIds.length > 0 && { partitionIds }),
            };
            dispatch(machineActions.updateVmfsDatastore(params));
          }}
          validationSchema={UpdateDatastoreSchema}
        >
          <FormikFormContent<UpdateDatastoreValues, MachineEventErrors>
            allowUnchanged
            cleanup={machineActions.cleanup}
            errors={errors}
            onCancel={closeForm}
            onSaveAnalytics={{
              action: "Update datastore",
              category: "Machine storage",
              label: "Add to datastore",
            }}
            saved={saved}
            saving={saving}
            submitLabel="Add to datastore"
          >
            <UpdateDatastoreFields
              datastores={datastores}
              storageDevices={selected}
            />
          </FormikFormContent>
        </Formik>
      </FormCard>
    );
  }
  return null;
};

export default UpdateDatastore;
