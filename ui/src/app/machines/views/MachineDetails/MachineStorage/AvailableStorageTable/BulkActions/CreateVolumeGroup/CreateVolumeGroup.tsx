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
  isMachineDetails,
  splitDiskPartitionIds,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";
import { DiskTypes } from "app/store/types/enum";
import type { Disk, Partition } from "app/store/types/node";

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

  if (isMachineDetails(machine)) {
    return (
      <FormCard sidebar={false}>
        <Formik
          initialValues={{
            name: getInitialName(machine.disks),
          }}
          onSubmit={(values: CreateVolumeGroupValues) => {
            const [blockDeviceIds, partitionIds] =
              splitDiskPartitionIds(selected);
            const params = {
              name: values.name,
              systemId,
              ...(blockDeviceIds.length > 0 && { blockDeviceIds }),
              ...(partitionIds.length > 0 && { partitionIds }),
            };
            dispatch(machineActions.createVolumeGroup(params));
          }}
          validationSchema={CreateVolumeGroupSchema}
        >
          <FormikFormContent<CreateVolumeGroupValues, MachineEventErrors>
            allowUnchanged
            cleanup={machineActions.cleanup}
            errors={errors}
            onCancel={closeForm}
            onSaveAnalytics={{
              action: "Create volume group",
              category: "Machine storage",
              label: "Create volume group",
            }}
            saved={saved}
            saving={saving}
            submitLabel="Create volume group"
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
                  disabled
                  label="Size"
                  value={`${formatSize(totalSize)}`}
                  type="text"
                />
                <Input disabled label="Type" value="Volume group" type="text" />
              </Col>
            </Row>
          </FormikFormContent>
        </Formik>
      </FormCard>
    );
  }
  return null;
};

export default CreateVolumeGroup;
