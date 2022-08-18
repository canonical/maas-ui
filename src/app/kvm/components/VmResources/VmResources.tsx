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
            toggleAppearance="link"
            toggleClassName="vm-resources__toggle is-dense"
            toggleDisabled={vms.length === 0}
            toggleLabel={`Total VMs: ${vms.length}`}
          >
            {/* TODO: update to use the new API: 
            https://github.com/canonical/app-tribe/issues/1117 */}
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
              paginateLimit={5}
              setSortDirection={() => null}
              setSortKey={() => null}
              showActions={false}
              sortDirection="none"
              sortKey={null}
            />
          </ContextualMenu>
        )}
      </div>
    </div>
  );
};

export default VmResources;
