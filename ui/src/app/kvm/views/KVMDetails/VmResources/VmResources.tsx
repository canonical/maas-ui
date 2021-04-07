import { ContextualMenu } from "@canonical/react-components";

import MachineListTable from "app/machines/views/MachineList/MachineListTable";
import type { Machine } from "app/store/machine/types";

export type Props = {
  vms: Machine[];
};

const VmResources = ({ vms }: Props): JSX.Element => {
  return (
    <div className="vm-resources">
      <h4 className="vm-resources__header p-heading--small">Total VMs</h4>
      <div className="vm-resources__dropdown-container">
        <ContextualMenu
          data-test="vms-dropdown"
          dropdownClassName="vm-resources__dropdown"
          hasToggleIcon
          toggleAppearance="base"
          toggleClassName="vm-resources__toggle is-dense"
          toggleDisabled={vms.length === 0}
          toggleLabel={`${vms.length}`}
        >
          <MachineListTable
            hiddenColumns={[
              "owner",
              "pool",
              "zone",
              "fabric",
              "disks",
              "storage",
            ]}
            machines={vms}
            showActions={false}
            paginateLimit={5}
          />
        </ContextualMenu>
      </div>
    </div>
  );
};

export default VmResources;
