import {
  Col,
  Input,
  Row,
  Select,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { UpdateDatastoreValues } from "../UpdateDatastore";

import FormikField from "app/base/components/FormikField";
import type { Disk, Partition } from "app/store/machine/types";
import { formatSize, formatType } from "app/store/machine/utils";

type Props = {
  datastores: Disk[];
  storageDevices: (Disk | Partition)[];
};

export const UpdateDatastoreFields = ({
  datastores,
  storageDevices,
}: Props): JSX.Element => {
  const { values } = useFormikContext<UpdateDatastoreValues>();
  const selectedDatastore = datastores.find(
    (datastore) => datastore.id === Number(values.datastore)
  );
  const totalSize = storageDevices.reduce(
    (sum, device) => (sum += device.size),
    0
  );

  return (
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
            {storageDevices.map((device) => (
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
        <FormikField
          component={Select}
          label="Datastore"
          name="datastore"
          options={datastores.map((datastore) => ({
            label: datastore.name,
            key: datastore.id,
            value: datastore.id,
          }))}
        />
        <Input
          data-test="datastore-mount-point"
          disabled
          label="Mount point"
          value={selectedDatastore?.filesystem?.mount_point || ""}
          type="text"
        />
        <Input
          data-test="size-to-add"
          disabled
          label="Size to add"
          value={`${formatSize(totalSize)}`}
          type="text"
        />
      </Col>
    </Row>
  );
};

export default UpdateDatastoreFields;
