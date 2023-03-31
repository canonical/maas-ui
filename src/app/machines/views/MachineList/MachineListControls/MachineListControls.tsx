import { useCallback, useEffect, useState } from "react";

import { Button, Icon } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom-v5-compat";
import { useStorageState } from "react-storage-hooks";

import AddHardwareMenu from "../MachineListHeader/AddHardwareMenu";

import GroupSelect from "./GroupSelect";
import HiddenColumnsSelect from "./HiddenColumnsSelect";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import NodeActionMenuGroup from "app/base/components/NodeActionMenuGroup";
import { useSendAnalytics } from "app/base/hooks";
import urls from "app/base/urls";
import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetSidePanelContent } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { FetchGroupKey } from "app/store/machine/types";
import { useHasSelection } from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

export type MachineListControlsProps = {
  machineCount: number;
  resourcePoolsCount: number;
  filter: string;
  grouping: FetchGroupKey | null;
  setFilter: (filter: string) => void;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenGroups: (groups: string[]) => void;
  hiddenColumns: string[];
  setHiddenColumns: React.Dispatch<React.SetStateAction<string[]>>;
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
  const sendAnalytics = useSendAnalytics();
  const dispatch = useDispatch();
  const [tagsSeen, setTagsSeen] = useStorageState(
    localStorage,
    "machineViewTagsSeen",
    false
  );

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText(filter);
  }, [filter]);

  const getTitle = useCallback(
    (action: NodeActions) => {
      if (action === NodeActions.TAG) {
        const title = getNodeActionTitle(action);
        if (!tagsSeen) {
          return (
            <>
              {title} <i className="p-text--small">(NEW)</i>
            </>
          );
        }
        return title;
      }
      return null;
    },
    [tagsSeen]
  );

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
      {!hasSelection ? (
        <>
          <div>
            <MachinesFilterAccordion
              searchText={searchText}
              setSearchText={(searchText) => {
                setFilter(searchText);
              }}
            />
          </div>
          <div className="u-flex--grow">
            <DebounceSearchBox
              onDebounced={(debouncedText) => setFilter(debouncedText)}
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </div>
          <div>
            <div className="u-flex--align-baseline">
              <div className="u-flex--grow">
                <GroupSelect
                  grouping={grouping}
                  setGrouping={setGrouping}
                  setHiddenGroups={setHiddenGroups}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <NodeActionMenuGroup
              alwaysShowLifecycle
              excludeActions={[NodeActions.IMPORT_IMAGES]}
              getTitle={getTitle}
              hasSelection={hasSelection}
              nodeDisplay="machine"
              onActionClick={(action) => {
                if (action === NodeActions.TAG && !tagsSeen) {
                  setTagsSeen(true);
                }
                const view = Object.values(MachineHeaderViews).find(
                  ([, actionName]) => actionName === action
                );
                if (view) {
                  setSidePanelContent({ view });
                }
                sendAnalytics(
                  "Machine list action form",
                  getNodeActionTitle(action),
                  "Open"
                );
              }}
            />
            <NodeActionMenu
              alwaysShowLifecycle
              excludeActions={[NodeActions.IMPORT_IMAGES]}
              getTitle={getTitle}
              hasSelection={hasSelection}
              nodeDisplay="machine"
              onActionClick={(action) => {
                if (action === NodeActions.TAG && !tagsSeen) {
                  setTagsSeen(true);
                }
                const view = Object.values(MachineHeaderViews).find(
                  ([, actionName]) => actionName === action
                );
                if (view) {
                  setSidePanelContent({ view });
                }
                sendAnalytics(
                  "Machine list action form",
                  getNodeActionTitle(action),
                  "Open"
                );
              }}
              toggleAppearance=""
              toggleClassName="p-action-menu filter-accordion__toggle u-no-margin--bottom"
              toggleLabel="Menu"
            />
          </div>
          <div className="u-flex--center">
            <Button
              appearance="link"
              onClick={() => dispatch(machineActions.setSelectedMachines(null))}
            >
              Clear selection <Icon name="close-link" />
            </Button>
          </div>
        </>
      )}

      <AddHardwareMenu
        disabled={hasSelection}
        key="add-hardware"
        setSidePanelContent={setSidePanelContent}
      />

      <div>
        <HiddenColumnsSelect
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
      </div>
    </div>
  );
};

export default MachineListControls;
