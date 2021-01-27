import {
  Col,
  Input,
  Row,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import {
  formatSize,
  formatType,
  isDatastore,
  splitDiskPartitionIds,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type CreateDatastoreValues = {
  name: string;
};

type Props = {
  closeForm: () => void;
  selected: (Disk | Partition)[];
  systemId: Machine["system_id"];
};

/**
 * Get the initial name of the datastore for the form, which is a simple count
 * of the number of existing datastores, indexed at 1 to match the api.
 * @param disks - the disks to search for datastores.
 * @returns initial name of the datastore for the form
 */
const getInitialName = (disks: Disk[]) => {
  if (!disks || disks.length === 0) {
    return "datastore1";
  }
  const datastoresCount = disks.reduce<number>(
    (count, disk) => (isDatastore(disk.filesystem) ? count + 1 : count),
    1
  );
  return `datastore${datastoresCount}`;
};

const CreateDatastoreSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export const CreateDatastore = ({
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
    "creatingVmfsDatastore",
    "createVmfsDatastore",
    () => closeForm()
  );
  const totalSize = selected.reduce((sum, device) => (sum += device.size), 0);

  if (machine && "disks" in machine) {
    return (
      <FormCard sidebar={false}>
        <FormikForm
          allowUnchanged
          buttons={FormCardButtons}
          cleanup={machineActions.cleanup}
          errors={errors}
          initialValues={{
            name: getInitialName(machine.disks),
          }}
          onCancel={closeForm}
          onSaveAnalytics={{
            action: "Create datastore",
            category: "Machine storage",
            label: "Create datastore",
          }}
          onSubmit={(values: CreateDatastoreValues) => {
            const [blockDeviceIds, partitionIds] = splitDiskPartitionIds(
              selected
            );
            const params = {
              name: values.name,
              systemId,
              ...(blockDeviceIds.length > 0 && { blockDeviceIds }),
              ...(partitionIds.length > 0 && { partitionIds }),
            };
            dispatch(machineActions.createVmfsDatastore(params));
          }}
          saved={saved}
          saving={saving}
          submitLabel="Create datastore"
          validationSchema={CreateDatastoreSchema}
        >
          <Row>
            <Col small="4" medium="6" size="6">
              <Table>
                <thead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Size</TableHeader>
                    <TableHeader>Device type</TableHeader>
                  </TableRow>
                </thead>
                <tbody>
                  {selected.map((device) => (
                    <TableRow key={`${device.type}-${device.id}`}>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{formatSize(device.size)}</TableCell>
                      <TableCell>{formatType(device)}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col small="4" medium="6" size="6">
              <FormikField label="Name" name="name" required type="text" />
              <Input
                data-test="datastore-size"
                disabled
                label="Size"
                value={`${formatSize(totalSize)}`}
                type="text"
              />
              <Input disabled label="Filesystem" value="VMFS6" type="text" />
            </Col>
          </Row>
        </FormikForm>
      </FormCard>
    );
  }
  return null;
};

export default CreateDatastore;
