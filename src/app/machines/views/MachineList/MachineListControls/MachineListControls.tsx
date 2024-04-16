import { useEffect, useState } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Col, Icon } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import DebounceSearchBox from "@/app/base/components/DebounceSearchBox";
import GroupSelect from "@/app/base/components/GroupSelect";
import urls from "@/app/base/urls";
import { groupOptions } from "@/app/machines/constants";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import HiddenColumnsSelect from "@/app/machines/views/MachineList/MachineListControls/HiddenColumnsSelect";
import MachineActionMenu from "@/app/machines/views/MachineList/MachineListControls/MachineActionMenu";
import MachinesFilterAccordion from "@/app/machines/views/MachineList/MachineListControls/MachinesFilterAccordion";
import AddHardwareMenu from "@/app/machines/views/MachineList/MachineListHeader/AddHardwareMenu";
import type { useResponsiveColumns } from "@/app/machines/views/MachineList/hooks";
import { machineActions } from "@/app/store/machine";
import type { FetchGroupKey } from "@/app/store/machine/types";
import { useHasSelection } from "@/app/store/machine/utils/hooks";

export type MachineListControlsProps = {
  machineCount: number;
  resourcePoolsCount: number;
  filter: string;
  grouping: FetchGroupKey | null;
  setFilter: (filter: string) => void;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
  hiddenColumns: string[];
  setHiddenColumns: ReturnType<typeof useResponsiveColumns>[1];
  setSidePanelContent: MachineSetSidePanelContent;
};

const MachineListControls = ({
  machineCount,
  resourcePoolsCount,
  filter,
  grouping,
  setFilter,
  setGrouping,
  setHiddenGroups,
  hiddenColumns,
  setHiddenColumns,
  setSidePanelContent,
}: MachineListControlsProps): JSX.Element => {
  const [searchText, setSearchText] = useState(filter);
  const hasSelection = useHasSelection();
  const dispatch = useDispatch();

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  return (
    <MainToolbar>
      <MainToolbar.Title>
        {machineCount} machines in{" "}
        <Link to={urls.pools.index}>
          {resourcePoolsCount} {pluralize("pool", resourcePoolsCount)}
        </Link>
      </MainToolbar.Title>
      <MainToolbar.Controls>
        {!hasSelection ? (
          <>
            <Col size={3}>
              <MachinesFilterAccordion
                searchText={searchText}
                setSearchText={(searchText) => {
                  setFilter(searchText);
                }}
              />
            </Col>
            <DebounceSearchBox
              onDebounced={(debouncedText) => setFilter(debouncedText)}
              searchText={searchText}
              setSearchText={setSearchText}
            />
            <GroupSelect<FetchGroupKey>
              groupOptions={groupOptions}
              grouping={grouping}
              setGrouping={setGrouping}
              setHiddenGroups={setHiddenGroups}
            />
          </>
        ) : (
          <>
            <MachineActionMenu
              hasSelection={hasSelection}
              setSidePanelContent={setSidePanelContent}
            />
            <Button
              appearance="link"
              onClick={() => dispatch(machineActions.setSelected(null))}
            >
              Clear selection <Icon name="close-link" />
            </Button>
          </>
        )}
        {!hasSelection ? (
          <span className="u-hide--small u-hide--medium">
            <AddHardwareMenu
              key="add-hardware"
              setSidePanelContent={setSidePanelContent}
            />
          </span>
        ) : null}
        <HiddenColumnsSelect
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default MachineListControls;
