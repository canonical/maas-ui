import type { ReactNode } from "react";

import { MainToolbar, useSidePanel } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";
import pluralize from "pluralize";
import { Link } from "react-router";

import { usePoolCount } from "@/app/api/query/pools";
import { useHasEntitlements } from "@/app/base/hooks";
import urls from "@/app/base/urls";
import { AddPool } from "@/app/pools/components";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { useFetchMachineCount } from "@/app/store/machine/utils/hooks";

const PoolsListHeader = (): ReactNode => {
  const { openSidePanel } = useSidePanel();
  const { machineCount } = useFetchMachineCount();
  const resourcePoolsCount = usePoolCount();
  const count = resourcePoolsCount?.data ? resourcePoolsCount.data : 0;
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

  return (
    <MainToolbar>
      <MainToolbar.Title>
        <Link to={urls.machines.index}>{machineCount} machines</Link>
        {` in ${count} ${pluralize("pool", count)}`}
      </MainToolbar.Title>
      <MainToolbar.Controls>
        <Button
          data-testid="add-pool"
          disabled={!canEdit}
          key="add-pool"
          onClick={() => {
            openSidePanel({ component: AddPool, title: "Add pool" });
          }}
        >
          Add pool
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default PoolsListHeader;
