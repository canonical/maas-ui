import { GenericTable } from "@canonical/maas-react-components";
import { Col, Input, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import type { CreateVolumeGroupColumnData } from "./useCreateVolumeGroupColumns/useCreateVolumeGroupColumns";
import useCreateVolumeGroupColumns from "./useCreateVolumeGroupColumns/useCreateVolumeGroupColumns";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useMachineDetailsForm } from "@/app/machines/hooks";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import type { Machine } from "@/app/store/machine/types";
import type { MachineEventErrors } from "@/app/store/machine/types/base";
import { isMachineDetails } from "@/app/store/machine/utils";
import type { RootState } from "@/app/store/root/types";
import { DiskTypes } from "@/app/store/types/enum";
import type { Disk, Partition } from "@/app/store/types/node";
import { formatSize, splitDiskPartitionIds } from "@/app/store/utils";

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
}: Props): React.ReactElement | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const columns = useCreateVolumeGroupColumns();
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingVolumeGroup",
    "createVolumeGroup",
    () => {
      closeForm();
    }
  );
  const totalSize = selected.reduce((sum, device) => (sum += device.size), 0);

  if (isMachineDetails(machine)) {
    return (
      <FormikForm<CreateVolumeGroupValues, MachineEventErrors>
        allowUnchanged
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
        saved={saved}
        saving={saving}
        submitLabel="Create volume group"
        validationSchema={CreateVolumeGroupSchema}
      >
        <Row>
          <Col size={12}>
            <GenericTable<CreateVolumeGroupColumnData>
              columns={columns}
              data={selected}
              isLoading={false}
              noData="No devices selected."
            />
          </Col>
          <Col size={12}>
            <FormikField label="Name" name="name" required type="text" />
            <Input
              aria-label="Size"
              disabled
              label="Size"
              type="text"
              value={`${formatSize(totalSize)}`}
            />
            <Input
              aria-label="Type"
              disabled
              label="Type"
              type="text"
              value="Volume group"
            />
          </Col>
        </Row>
      </FormikForm>
    );
  }
  return null;
};

export default CreateVolumeGroup;
