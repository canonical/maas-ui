import { useSelector } from "react-redux";

import MachineNotifications from "app/machines/views/MachineDetails/MachineNotifications";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import {
  canOsSupportBcacheZFS,
  canOsSupportStorageConfig,
  isMachineStorageConfigurable,
  useCanEdit,
} from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  id: Machine["system_id"];
};

const StorageNotifications = ({ id }: Props): JSX.Element | null => {
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const canEdit = useCanEdit(machine, true);
  const machineStorageConfigurable = isMachineStorageConfigurable(machine);
  const osSupportsStorageConfig = canOsSupportStorageConfig(machine);
  const osSupportsBcacheZFS = canOsSupportBcacheZFS(machine);

  if (!machine || !("disks" in machine)) {
    return null;
  }

  // If the machine has not been commissioned just show the one notification.
  // Otherwise show all that are relevant.
  const notifications =
    machine.disks.length === 0
      ? [
          {
            active: true,
            content:
              "No storage information. Commission this machine to gather storage information.",
            status: "Error:",
            type: "negative" as const,
          },
        ]
      : [
          {
            active: canEdit && !machineStorageConfigurable,
            content:
              "Storage configuration cannot be modified unless the machine is Ready or Allocated.",
          },
          {
            active: canEdit && !osSupportsStorageConfig,
            content:
              "Custom storage configuration is only supported on Ubuntu, CentOS, and RHEL.",
          },
          {
            active: canEdit && !osSupportsBcacheZFS,
            content: "Bcache and ZFS are only supported on Ubuntu.",
          },
          ...(machine.storage_layout_issues?.length > 0
            ? machine.storage_layout_issues.map((issue) => ({
                active: true,
                content: `${issue}`,
                status: "Error:",
                type: "negative" as const,
              }))
            : []),
        ];

  return <MachineNotifications notifications={notifications} />;
};

export default StorageNotifications;
