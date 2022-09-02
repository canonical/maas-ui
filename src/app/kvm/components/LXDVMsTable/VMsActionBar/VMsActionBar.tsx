import { Button, Icon, Tooltip } from "@canonical/react-components";

import ActionBar from "app/base/components/ActionBar";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import type { SetSearchFilter } from "app/base/types";
import { VMS_PER_PAGE } from "app/kvm/components/LXDVMsTable";
import type { KVMSetHeaderContent } from "app/kvm/types";
import { MachineHeaderViews } from "app/machines/constants";
import { useHasSelection } from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";

type Props = {
  currentPage: number;
  machinesLoading: boolean;
  onAddVMClick?: () => void;
  searchFilter: string;
  setCurrentPage: (page: number) => void;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
  vmCount: number;
};

const VMsActionBar = ({
  currentPage,
  machinesLoading,
  onAddVMClick,
  searchFilter,
  setCurrentPage,
  setSearchFilter,
  setHeaderContent,
  vmCount,
}: Props): JSX.Element | null => {
  const hasSelection = useHasSelection();
  const vmActionsDisabled = !hasSelection;

  return (
    <ActionBar
      actions={
        <>
          <NodeActionMenu
            alwaysShowLifecycle
            data-testid="vm-actions"
            disabledTooltipPosition="top-left"
            excludeActions={[NodeActions.DELETE]}
            hasSelection={hasSelection}
            menuPosition="left"
            nodeDisplay="VM"
            onActionClick={(action) => {
              const view = Object.values(MachineHeaderViews).find(
                ([, actionName]) => actionName === action
              );
              if (view) {
                setHeaderContent({ view });
              }
            }}
            toggleClassName="u-no-margin--bottom"
          />
          {onAddVMClick && (
            <span className="u-nudge-right">
              <Button
                className="u-no-margin--bottom"
                data-testid="add-vm"
                hasIcon
                onClick={onAddVMClick}
              >
                <Icon name="plus" />
                <span>Add VM</span>
              </Button>
            </span>
          )}
          <Tooltip
            className="u-nudge-right"
            message={
              vmActionsDisabled
                ? "Select VMs below to perform an action."
                : null
            }
          >
            <Button
              className="u-no-margin--bottom"
              data-testid="delete-vm"
              disabled={vmActionsDisabled}
              hasIcon
              onClick={() =>
                setHeaderContent({ view: MachineHeaderViews.DELETE_MACHINE })
              }
            >
              <Icon name="delete" />
              <span>Delete VM</span>
            </Button>
          </Tooltip>
        </>
      }
      currentPage={currentPage}
      itemCount={vmCount}
      loading={machinesLoading}
      onSearchChange={setSearchFilter}
      pageSize={VMS_PER_PAGE}
      searchFilter={searchFilter}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default VMsActionBar;
