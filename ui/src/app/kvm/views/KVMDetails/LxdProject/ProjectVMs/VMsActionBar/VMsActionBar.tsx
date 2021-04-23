import { Button, Icon, SearchBox, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { VMS_PER_PAGE } from "../ProjectVMs";

import ArrowPagination from "app/base/components/ArrowPagination";
import type {
  SetSearchFilter,
  SetSelectedAction,
} from "app/kvm/views/KVMDetails";
import { KVMAction } from "app/kvm/views/KVMDetails";
import VmActionMenu from "app/machines/components/TakeActionMenu";
import machineSelectors from "app/store/machine/selectors";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  currentPage: number;
  id: Pod["id"];
  searchFilter: string;
  setCurrentPage: (page: number) => void;
  setSearchFilter: SetSearchFilter;
  setSelectedAction: SetSelectedAction;
};

const VMsActionBar = ({
  currentPage,
  id,
  searchFilter,
  setCurrentPage,
  setSearchFilter,
  setSelectedAction,
}: Props): JSX.Element | null => {
  const loading = useSelector(machineSelectors.loading);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const vms = useSelector((state: RootState) =>
    podSelectors.filteredVMs(state, id, searchFilter)
  );
  const vmActionsDisabled = selectedIDs.length === 0;

  return (
    <div className="vms-action-bar">
      <div className="vms-action-bar__actions">
        <Button
          className="u-no-margin--bottom"
          data-test="compose-vm"
          hasIcon
          onClick={() => setSelectedAction(KVMAction.COMPOSE)}
        >
          <Icon name="plus" />
          <span>Compose VM</span>
        </Button>
        <VmActionMenu
          data-test="vm-actions"
          appearance="vmTable"
          setSelectedAction={setSelectedAction}
        />
        <span className="u-nudge-right">
          <Button
            className="u-rotate-right"
            appearance="base"
            data-test="refresh-kvm"
            hasIcon
            onClick={() => setSelectedAction(KVMAction.REFRESH)}
            small
          >
            <Icon name="restart" />
          </Button>
        </span>
        <Tooltip
          className="u-nudge-right"
          message={
            vmActionsDisabled ? "Select VMs below to perform an action." : null
          }
        >
          <Button
            appearance="base"
            data-test="delete-vm"
            disabled={vmActionsDisabled}
            hasIcon
            onClick={() => setSelectedAction({ name: NodeActions.DELETE })}
            small
          >
            <Icon name="delete" />
          </Button>
        </Tooltip>
      </div>
      <div className="vms-action-bar__search">
        <SearchBox
          className="u-no-margin--bottom"
          externallyControlled
          onChange={(searchFilter: string) => {
            setSearchFilter(searchFilter);
          }}
          value={searchFilter}
        />
      </div>
      <div className="vms-action-bar__pagination">
        <ArrowPagination
          className="u-display-inline-block"
          currentPage={currentPage}
          itemCount={vms.length}
          loading={loading}
          pageSize={VMS_PER_PAGE}
          setCurrentPage={setCurrentPage}
          showPageBounds
        />
      </div>
    </div>
  );
};

export default VMsActionBar;
