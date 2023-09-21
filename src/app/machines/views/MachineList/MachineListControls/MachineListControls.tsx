import { useEffect, useState } from "react";

import { Button, Icon } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom-v5-compat";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import urls from "app/base/urls";
import type { MachineSetSidePanelContent } from "app/machines/types";
import GroupSelect from "app/machines/views/MachineList/MachineListControls/GroupSelect";
import HiddenColumnsSelect from "app/machines/views/MachineList/MachineListControls/HiddenColumnsSelect";
import MachineActionMenu from "app/machines/views/MachineList/MachineListControls/MachineActionMenu";
import MachinesFilterAccordion from "app/machines/views/MachineList/MachineListControls/MachinesFilterAccordion";
import AddHardwareMenu from "app/machines/views/MachineList/MachineListHeader/AddHardwareMenu";
import type { useResponsiveColumns } from "app/machines/views/MachineList/hooks";
import { actions as machineActions } from "app/store/machine";
import type { FetchGroupKey } from "app/store/machine/types";
import { useHasSelection } from "app/store/machine/utils/hooks";

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
    <div className="machine-list-controls">
      <h1
        className="section-header__title p-heading--4"
        data-testid="section-header-title"
      >
        {machineCount} machines in{" "}
        <Link to={urls.pools.index}>
          {resourcePoolsCount} {pluralize("pool", resourcePoolsCount)}
        </Link>
      </h1>
      <div className="machine-list-controls-inputs">
        {!hasSelection ? (
          <>
            <div className="machine-list-controls__item">
              <MachinesFilterAccordion
                searchText={searchText}
                setSearchText={(searchText) => {
                  setFilter(searchText);
                }}
              />
            </div>
            <div className="machine-list-controls__item u-flex--grow">
              <DebounceSearchBox
                onDebounced={(debouncedText) => setFilter(debouncedText)}
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </div>
            <div className="machine-list-controls__item u-hide--small u-hide--medium u-flex--align-baseline">
              <GroupSelect
                grouping={grouping}
                setGrouping={setGrouping}
                setHiddenGroups={setHiddenGroups}
              />
            </div>
          </>
        ) : (
          <>
            <div className="machine-list-controls__item">
              <MachineActionMenu
                hasSelection={hasSelection}
                setSidePanelContent={setSidePanelContent}
              />
            </div>
            <div className="machine-list-controls__item">
              <Button
                appearance="link"
                onClick={() => dispatch(machineActions.setSelected(null))}
              >
                Clear selection <Icon name="close-link" />
              </Button>
            </div>
          </>
        )}
        {!hasSelection ? (
          <div className="machine-list-controls__item u-hide--small u-hide--medium">
            <AddHardwareMenu
              key="add-hardware"
              setSidePanelContent={setSidePanelContent}
            />
          </div>
        ) : null}
        <div className="machine-list-controls__item">
          <HiddenColumnsSelect
            hiddenColumns={hiddenColumns}
            setHiddenColumns={setHiddenColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default MachineListControls;
