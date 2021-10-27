import { Button, Icon, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import KVMActionBar from "../../KVMActionBar";

import type { SetSearchFilter } from "app/base/types";
import type { KVMSetHeaderContent } from "app/kvm/types";
import VmActionMenu from "app/machines/components/TakeActionMenu";
import { MachineHeaderViews } from "app/machines/constants";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  currentPage: number;
  onRefreshClick: () => void;
  searchFilter: string;
  setCurrentPage: (page: number) => void;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
  vms: Machine[];
};

const VMsActionBar = ({
  currentPage,
  onRefreshClick,
  searchFilter,
  setCurrentPage,
  setSearchFilter,
  setHeaderContent,
  vms,
}: Props): JSX.Element | null => {
  const loading = useSelector(machineSelectors.loading);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const vmActionsDisabled = selectedIDs.length === 0;

  return (
    <KVMActionBar
      actions={
        <>
          <VmActionMenu
            appearance="vmTable"
            data-test="vm-actions"
            excludeActions={[NodeActions.DELETE]}
            setHeaderContent={setHeaderContent}
          />
          <span className="u-nudge-right">
            <Button
              className="u-rotate-right"
              appearance="base"
              data-test="refresh-kvm"
              hasIcon
              onClick={onRefreshClick}
              small
            >
              <Icon name="restart" />
            </Button>
          </span>
          <Tooltip
            className="u-nudge-right"
            message={
              vmActionsDisabled
                ? "Select VMs below to perform an action."
                : null
            }
          >
            <Button
              appearance="base"
              data-test="delete-vm"
              disabled={vmActionsDisabled}
              hasIcon
              onClick={() =>
                setHeaderContent({ view: MachineHeaderViews.DELETE_MACHINE })
              }
              small
            >
              <Icon name="delete" />
            </Button>
          </Tooltip>
        </>
      }
      currentPage={currentPage}
      itemCount={vms.length}
      loading={loading}
      onSearchChange={setSearchFilter}
      searchFilter={searchFilter}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default VMsActionBar;
