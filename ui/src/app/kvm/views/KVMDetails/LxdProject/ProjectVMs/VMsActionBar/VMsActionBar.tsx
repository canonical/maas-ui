import { Button, Icon, SearchBox, Spinner } from "@canonical/react-components";

import ArrowPagination from "app/base/components/ArrowPagination";
import type { SetSelectedAction } from "app/kvm/views/KVMDetails";
import { KVMAction } from "app/kvm/views/KVMDetails";
import type { Machine } from "app/store/machine/types";

type Props = {
  loading?: boolean;
  setSelectedAction: SetSelectedAction;
  vms: Machine[];
};

const VMsActionBar = ({
  loading = false,
  setSelectedAction,
  vms,
}: Props): JSX.Element => {
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
        <Button appearance="base" hasIcon small>
          <Icon name="menu" />
        </Button>
        <Button
          appearance="base"
          data-test="refresh-kvm"
          hasIcon
          onClick={() => setSelectedAction(KVMAction.REFRESH)}
          small
        >
          <Icon name="restart" />
        </Button>
        <Button appearance="base" hasIcon small>
          <Icon name="delete" />
        </Button>
      </div>
      <div className="vms-action-bar__search">
        <SearchBox className="u-no-margin--bottom" onChange={() => null} />
      </div>
      <div className="vms-action-bar__pagination">
        <span className="u-text--muted u-nudge-left" data-test="vms-count">
          {loading ? <Spinner /> : `1 - ${vms.length} of ${vms.length}`}
        </span>
        <ArrowPagination
          className="u-display-inline-block"
          currentPage={1}
          itemCount={vms.length}
          pageSize={25}
          setCurrentPage={() => null}
        />
      </div>
    </div>
  );
};

export default VMsActionBar;
