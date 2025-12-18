import type { ReactElement } from "react";

import { Button, Icon, Tooltip } from "@canonical/react-components";

import ActionBar from "@/app/base/components/ActionBar";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { SetSearchFilter } from "@/app/base/types";
import DeleteVM from "@/app/kvm/components/DeleteVM";
import { VMS_PER_PAGE } from "@/app/kvm/components/LXDVMsTable";
import MachineActionMenu from "@/app/machines/components/MachineActions/MachineActionMenu";
import { useHasSelection } from "@/app/store/machine/utils/hooks";

type Props = {
  currentPage: number;
  machinesLoading?: boolean;
  onAddVMClick?: () => void;
  searchFilter: string;
  setCurrentPage: (page: number) => void;
  setSearchFilter: SetSearchFilter;
  vmCount: number;
};

const VMsActionBar = ({
  currentPage,
  machinesLoading,
  onAddVMClick,
  searchFilter,
  setCurrentPage,
  setSearchFilter,
  vmCount,
}: Props): ReactElement => {
  const { openSidePanel } = useSidePanel();
  const hasSelection = useHasSelection();
  const vmActionsDisabled = !hasSelection;

  return (
    <ActionBar
      actions={
        <>
          <MachineActionMenu />
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
              onClick={() => {
                openSidePanel({
                  component: DeleteVM,
                  title: "Delete VMs",
                });
              }}
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
