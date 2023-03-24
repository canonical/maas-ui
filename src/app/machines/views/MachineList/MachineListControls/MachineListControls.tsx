import { useCallback, useEffect, useState } from "react";

import { Button, Col, Icon, Row } from "@canonical/react-components";
import { useDispatch } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import GroupSelect from "./GroupSelect";
import HiddenColumnsSelect from "./HiddenColumnsSelect";
import MachinesFilterAccordion from "./MachinesFilterAccordion";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import NodeActionMenu from "app/base/components/NodeActionMenu";
import NodeActionMenuGroup from "app/base/components/NodeActionMenuGroup";
import { useSendAnalytics } from "app/base/hooks";
import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetSidePanelContent } from "app/machines/types";
import { actions as machineActions } from "app/store/machine";
import type { FetchGroupKey } from "app/store/machine/types";
import { useHasSelection } from "app/store/machine/utils/hooks";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";

export type MachineListControlsProps = {
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
    <Row className="machine-list-controls">
      {!hasSelection ? (
        <>
          <Col size={2}>
            <MachinesFilterAccordion
              searchText={searchText}
              setSearchText={(searchText) => {
                setFilter(searchText);
              }}
            />
          </Col>
          <Col size={5}>
            <DebounceSearchBox
              onDebounced={(debouncedText) => setFilter(debouncedText)}
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </Col>
          <Col size={3}>
            <div className="u-flex--align-baseline">
              <div className="u-flex--grow">
                <GroupSelect
                  grouping={grouping}
                  setGrouping={setGrouping}
                  setHiddenGroups={setHiddenGroups}
                />
              </div>
            </div>
          </Col>
        </>
      ) : (
        <>
          <Col size={8}>
            <NodeActionMenuGroup
              alwaysShowLifecycle
              excludeActions={[NodeActions.IMPORT_IMAGES]}
              getTitle={getTitle}
              hasSelection={hasSelection}
              key="machine-list-action-menu"
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
              key="machine-list-action-menu"
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
          </Col>
          <Col className="u-flex--center" size={2}>
            <Button
              appearance="link"
              onClick={() => dispatch(machineActions.setSelectedMachines(null))}
            >
              Clear selection <Icon name="close-link" />
            </Button>
          </Col>
        </>
      )}

      <Col size={2}>
        <HiddenColumnsSelect
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
      </Col>
    </Row>
  );
};

export default MachineListControls;
