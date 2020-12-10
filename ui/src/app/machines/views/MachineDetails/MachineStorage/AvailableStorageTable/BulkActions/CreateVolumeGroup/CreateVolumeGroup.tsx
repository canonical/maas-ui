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
import { DiskTypes } from "app/store/machine/types";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import { formatSize, formatType, isDisk } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type CreateVolumeGroupValues = {
  name: string;
};

type Props = {
  closeForm: () => void;
  selected: (Disk | Partition)[];
  systemId: Machine["system_id"];
};

const getInitialName = (disks: Disk[]) => {
  if (!disks || disks.length === 0) {
    return "vg0";
  }
  const vgCount = disks.reduce<number>(
    (count, disk) => (disk.type === DiskTypes.VOLUME_GROUP ? count + 1 : count),
    0
  );
  return `vg${vgCount}`;
};

const CreateVolumeGroupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export const CreateVolumeGroup = ({
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
    "creatingVolumeGroup",
    "createVolumeGroup",
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
            action: "Create volume group",
            category: "Machine storage",
            label: "Create volume group",
          }}
          onSubmit={(values: CreateVolumeGroupValues) => {
            const [blockDeviceIds, partitionIds] = selected.reduce<number[][]>(
              ([diskIds, partitionIds], storageDevice: Disk | Partition) => {
                if (isDisk(storageDevice)) {
                  diskIds.push(storageDevice.id);
                } else {
                  partitionIds.push(storageDevice.id);
                }
                return [diskIds, partitionIds];
              },
              [[], []]
            );
            const params = {
              name: values.name,
              systemId,
              ...(blockDeviceIds.length > 0 && { blockDeviceIds }),
              ...(partitionIds.length > 0 && { partitionIds }),
            };
            dispatch(machineActions.createVolumeGroup(params));
          }}
          saved={saved}
          saving={saving}
          submitLabel="Create volume group"
          validationSchema={CreateVolumeGroupSchema}
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
                disabled
                label="Size"
                value={`${formatSize(totalSize)}`}
                type="text"
              />
              <Input disabled label="Type" value="Volume group" type="text" />
            </Col>
          </Row>
        </FormikForm>
      </FormCard>
    );
  }
  return null;
};

export default CreateVolumeGroup;
