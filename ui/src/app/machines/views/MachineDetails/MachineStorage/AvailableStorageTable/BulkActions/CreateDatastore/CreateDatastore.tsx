import {
  Col,
  Input,
  Row,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import FormCard from "app/base/components/FormCard";
import FormikField from "app/base/components/FormikField";
import FormikFormContent from "app/base/components/FormikFormContent";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import {
  formatSize,
  formatType,
  isDatastore,
  isMachineDetails,
  splitDiskPartitionIds,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import type { Disk, Partition } from "app/store/types/node";

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

  if (isMachineDetails(machine)) {
    return (
      <FormCard sidebar={false}>
        <Formik
          initialValues={{
            name: getInitialName(machine.disks),
          }}
          onSubmit={(values: CreateDatastoreValues) => {
            const [blockDeviceIds, partitionIds] =
              splitDiskPartitionIds(selected);
            const params = {
              name: values.name,
              systemId,
              ...(blockDeviceIds.length > 0 && { blockDeviceIds }),
              ...(partitionIds.length > 0 && { partitionIds }),
            };
            dispatch(machineActions.createVmfsDatastore(params));
          }}
          validationSchema={CreateDatastoreSchema}
        >
          <FormikFormContent<CreateDatastoreValues, MachineEventErrors>
            allowUnchanged
            cleanup={machineActions.cleanup}
            errors={errors}
            onCancel={closeForm}
            onSaveAnalytics={{
              action: "Create datastore",
              category: "Machine storage",
              label: "Create datastore",
            }}
            saved={saved}
            saving={saving}
            submitLabel="Create datastore"
          >
            <Row>
              <Col small={4} medium={6} size={6}>
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
              <Col small={4} medium={6} size={6}>
                <FormikField label="Name" name="name" required type="text" />
                <Input
                  data-testid="datastore-size"
                  disabled
                  label="Size"
                  value={`${formatSize(totalSize)}`}
                  type="text"
                />
                <Input disabled label="Filesystem" value="VMFS6" type="text" />
              </Col>
            </Row>
          </FormikFormContent>
        </Formik>
      </FormCard>
    );
  }
  return null;
};

export default CreateDatastore;
