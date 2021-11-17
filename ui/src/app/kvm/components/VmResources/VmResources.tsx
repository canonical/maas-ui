import { ContextualMenu, Spinner } from "@canonical/react-components";

import MachineListTable from "app/machines/views/MachineList/MachineListTable";
import type { Machine } from "app/store/machine/types";

export type Props = {
  loading?: boolean;
  vms: Machine[];
};

const VmResources = ({ loading = false, vms }: Props): JSX.Element => {
  return (
    <div className="vm-resources">
      <div className="vm-resources__dropdown-container">
        {loading ? (
          <Spinner text="Loading..." />
        ) : (
          <ContextualMenu
            data-testid="vms-dropdown"
            dropdownClassName="vm-resources__dropdown"
            toggleAppearance="base"
            toggleClassName="vm-resources__toggle is-dense p-button--link"
            toggleDisabled={vms.length === 0}
            toggleLabel={`Total VMs: ${vms.length}`}
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
        )}
      </div>
    </div>
  );
};

export default VmResources;
