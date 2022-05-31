import { Col, Icon, Input, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";

import FilesystemFields from "../../../FilesystemFields";
import type { CreateRaidValues } from "../CreateRaid";

import FormikField from "app/base/components/FormikField";
import TagNameField from "app/base/components/TagNameField";
import { RAID_MODES } from "app/store/machine/constants";
import type { RaidMode } from "app/store/machine/constants";
import type { Machine } from "app/store/machine/types";
import type { Disk, Partition } from "app/store/types/node";
import { formatSize, formatType, isDisk } from "app/store/utils";

type Props = {
  storageDevices: (Disk | Partition)[];
  systemId: Machine["system_id"];
};

/**
 * Get the size of the RAID, given the RAID mode and number of active devices.
 * @param storageDevices - the selected storage devices.
 * @param raidMode - the selected RAID mode.
 * @param numActive - the number of active (i.e not spare) devices.
 * @returns the size of the RAID in bytes.
 */
const getRaidSize = (
  storageDevices: (Disk | Partition)[],
  raidMode: RaidMode,
  numActive: number
) => {
  // Min size is disk.available_size for disks, partition.size for partitions
  const minSize = Math.min(
    ...storageDevices.map((storageDevice) =>
      isDisk(storageDevice) ? storageDevice.available_size : storageDevice.size
    )
  );
  return raidMode.calculateSize(minSize, numActive);
};

/**
 * Determine whether a storage device is selected to be a spare device.
 * @param storageDevice - the storage device to check.
 * @param spareBlockDeviceIds - the ids of the block devices selected to be spare.
 * @param sparePartitionIds - the ids of the partitions selected to be spare.
 * @returns whether the storage device is selected to be a spare device.
 */
const isSpare = (
  storageDevice: Disk | Partition,
  spareBlockDeviceIds: CreateRaidValues["spareBlockDeviceIds"],
  sparePartitionIds: CreateRaidValues["sparePartitionIds"]
) =>
  isDisk(storageDevice)
    ? spareBlockDeviceIds.includes(storageDevice.id)
    : sparePartitionIds.includes(storageDevice.id);

export const CreateRaidFields = ({
  storageDevices,
  systemId,
}: Props): JSX.Element => {
  const { handleChange, initialValues, setFieldValue, values } =
    useFormikContext<CreateRaidValues>();
  const {
    blockDeviceIds,
    level,
    partitionIds,
    spareBlockDeviceIds,
    sparePartitionIds,
  } = values;
  const availableRaidModes = RAID_MODES.filter(
    (raidMode) => storageDevices.length >= raidMode.minDevices
  );
  const selectedMode =
    RAID_MODES.find((raidMode) => raidMode.level === level) || RAID_MODES[0];
  const maxSpares = selectedMode.allowsSpares
    ? storageDevices.length - selectedMode.minDevices
    : 0;
  const numActive = blockDeviceIds.length + partitionIds.length;
  const numSpare = spareBlockDeviceIds.length + sparePartitionIds.length;
  const raidSize = getRaidSize(storageDevices, selectedMode, numActive);

  const handleSpareCheckbox = (
    storageDevice: Disk | Partition,
    isSpareDevice: boolean
  ) => {
    if (isDisk(storageDevice)) {
      if (isSpareDevice) {
        setFieldValue("blockDeviceIds", [...blockDeviceIds, storageDevice.id]);
        setFieldValue(
          "spareBlockDeviceIds",
          spareBlockDeviceIds.filter((id) => id !== storageDevice.id)
        );
      } else {
        setFieldValue(
          "blockDeviceIds",
          blockDeviceIds.filter((id) => id !== storageDevice.id)
        );
        setFieldValue("spareBlockDeviceIds", [
          ...spareBlockDeviceIds,
          storageDevice.id,
        ]);
      }
    } else {
      if (isSpareDevice) {
        setFieldValue("partitionIds", [...partitionIds, storageDevice.id]);
        setFieldValue(
          "sparePartitionIds",
          sparePartitionIds.filter((id) => id !== storageDevice.id)
        );
      } else {
        setFieldValue(
          "partitionIds",
          partitionIds.filter((id) => id !== storageDevice.id)
        );
        setFieldValue("sparePartitionIds", [
          ...sparePartitionIds,
          storageDevice.id,
        ]);
      }
    }
  };

  return (
    <>
      <Row>
        <Col size={5}>
          <FormikField label="Name" name="name" required type="text" />
          <FormikField<typeof Select>
            component={Select}
            label="RAID level"
            name="level"
            onChange={(e) => {
              handleChange(e);
              // We reset the block/partition id values on RAID level change
              // to prevent stale values from existing in the form state.
              setFieldValue("blockDeviceIds", initialValues.blockDeviceIds);
              setFieldValue("partitionIds", initialValues.partitionIds);
              setFieldValue(
                "spareBlockDeviceIds",
                initialValues.spareBlockDeviceIds
              );
              setFieldValue(
                "sparePartitionIds",
                initialValues.sparePartitionIds
              );
            }}
            options={availableRaidModes.map((raidMode) => ({
              label: raidMode.label,
              key: raidMode.level,
              value: raidMode.level,
            }))}
          />
          <Input
            data-testid="raid-size"
            disabled
            label="Size"
            type="text"
            value={formatSize(raidSize)}
          />
          <TagNameField />
        </Col>
        <Col emptyLarge={7} size={5}>
          <FilesystemFields systemId={systemId} />
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Type</th>
                {maxSpares > 0 && (
                  <>
                    <th>Active</th>
                    <th data-testid="max-spares">{`Spare (max ${maxSpares})`}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {storageDevices.map((storageDevice) => {
                const id = `raid-${storageDevice.type}-${storageDevice.id}`;
                const isSpareDevice = isSpare(
                  storageDevice,
                  spareBlockDeviceIds,
                  sparePartitionIds
                );

                return (
                  <tr key={id}>
                    <td>{storageDevice.name}</td>
                    <td>{formatSize(storageDevice.size)}</td>
                    <td>{formatType(storageDevice)}</td>
                    {maxSpares > 0 && (
                      <>
                        <td data-testid="active-status">
                          {isSpareDevice ? (
                            <Icon data-testid="is-spare" name="close" />
                          ) : (
                            <Icon data-testid="is-active" name="tick" />
                          )}
                        </td>
                        <td data-testid="spare-storage-device">
                          <Input
                            checked={isSpareDevice}
                            disabled={!isSpareDevice && numSpare >= maxSpares}
                            id={id}
                            label=" "
                            labelClassName="is-inline-label"
                            onChange={() =>
                              handleSpareCheckbox(storageDevice, isSpareDevice)
                            }
                            type="checkbox"
                          />
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
};

export default CreateRaidFields;
