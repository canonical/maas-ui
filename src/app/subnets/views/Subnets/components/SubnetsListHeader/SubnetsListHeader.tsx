import type { ChangeEvent, ReactElement } from "react";
import { useEffect, useCallback } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { ContextualMenu, Select } from "@canonical/react-components";
import { useNavigate } from "react-router";

import DebounceSearchBox from "@/app/base/components/DebounceSearchBox";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import type { SyncNavigateFunction } from "@/app/base/types";
import {
  AddFabric,
  AddSpace,
  AddSubnet,
  AddVlan,
} from "@/app/subnets/views/Subnets/components";
import { SubnetsColumns } from "@/app/subnets/views/Subnets/components/SubnetsTable/constants";
import type { GroupByKey } from "@/app/subnets/views/Subnets/components/SubnetsTable/types";
import { SubnetsUrlParams } from "@/app/subnets/views/Subnets/views/SubnetsList";

const subnetGroupingOptions = [
  {
    label: "Group by fabric",
    value: SubnetsColumns.FABRIC,
  },
  {
    label: "Group by space",
    value: SubnetsColumns.SPACE,
  },
];

type SubnetsListHeaderProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  grouping: string | null;
};

const SubnetsListHeader = ({
  searchText,
  setSearchText,
  grouping,
}: SubnetsListHeaderProps): ReactElement => {
  const { openSidePanel, closeSidePanel } = useSidePanel();
  const navigate: SyncNavigateFunction = useNavigate();

  const setGrouping = useCallback(
    (group: GroupByKey | null) => {
      navigate(
        {
          pathname: "/networks",
          search: `?${SubnetsUrlParams.By}=${group}&${SubnetsUrlParams.Q}=${searchText}`,
        },
        { replace: true }
      );
    },
    [navigate, searchText]
  );

  const handleSearch = useCallback(
    (searchText: string) => {
      navigate(
        {
          pathname: "/networks",
          search: `?${SubnetsUrlParams.By}=${grouping}&${SubnetsUrlParams.Q}=${searchText}`,
        },
        { replace: true }
      );
    },
    [navigate, grouping]
  );

  const hasValidGroupBy = grouping && ["fabric", "space"].includes(grouping);

  useEffect(() => {
    closeSidePanel();
    if (!hasValidGroupBy) {
      setGrouping("fabric");
    }
  }, [grouping, setGrouping, hasValidGroupBy, closeSidePanel]);

  return (
    <MainToolbar>
      <MainToolbar.Title>Subnets</MainToolbar.Title>
      <MainToolbar.Controls>
        <DebounceSearchBox
          onDebounced={handleSearch}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Select
          aria-label="Group by"
          className="u-no-padding--right subnet-group__select"
          defaultValue={grouping || ""}
          name="network-groupings"
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setGrouping((e.target.value as GroupByKey) ?? null);
          }}
          options={subnetGroupingOptions}
        />
        <ContextualMenu
          hasToggleIcon
          links={[
            {
              children: "Fabric",
              onClick: () => {
                openSidePanel({ component: AddFabric, title: "Add fabric" });
              },
            },
            {
              children: "VLAN",
              onClick: () => {
                openSidePanel({ component: AddVlan, title: "Add VLAN" });
              },
            },
            {
              children: "Space",
              onClick: () => {
                openSidePanel({ component: AddSpace, title: "Add space" });
              },
            },
            {
              children: "Subnet",
              onClick: () => {
                openSidePanel({ component: AddSubnet, title: "Add subnet" });
              },
            },
          ]}
          position="right"
          toggleAppearance="positive"
          toggleLabel="Add"
        />
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default SubnetsListHeader;
