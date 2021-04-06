import { Button, Icon, SearchBox, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { VMS_PER_PAGE } from "../ProjectVMs";

import ArrowPagination from "app/base/components/ArrowPagination";
import type { SetSelectedAction } from "app/kvm/views/KVMDetails";
import { KVMAction } from "app/kvm/views/KVMDetails";
import machineSelectors from "app/store/machine/selectors";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";

type Props = {
  currentPage: number;
  id: Pod["id"];
  setCurrentPage: (page: number) => void;
  setSelectedAction: SetSelectedAction;
};

const VMsActionBar = ({
  currentPage,
  id,
  setCurrentPage,
  setSelectedAction,
}: Props): JSX.Element | null => {
  const loading = useSelector(machineSelectors.loading);
  const selectedIDs = useSelector(machineSelectors.selectedIDs);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const vms = useSelector((state: RootState) =>
    podSelectors.getVMs(state, pod)
  );

  if (!pod) {
    return null;
  }
  const selectedPodVms = selectedIDs.filter((id) =>
    vms.some((vm) => vm.system_id === id)
  );
  const vmActionsDisabled = selectedPodVms.length === 0;
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
        <Tooltip
          message={
            vmActionsDisabled ? "Select VMs below to perform an action." : null
          }
        >
          <Button
            appearance="base"
            data-test="vm-actions"
            disabled={vmActionsDisabled}
            hasIcon
            small
          >
            <Icon name="menu" />
          </Button>
        </Tooltip>
        <span className="u-nudge-right">
          <Button
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
            small
          >
            <Icon name="delete" />
          </Button>
        </Tooltip>
      </div>
      <div className="vms-action-bar__search">
        <SearchBox className="u-no-margin--bottom" onChange={() => null} />
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
