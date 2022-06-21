import { useCallback, useEffect, useState } from "react";

import {
  Accordion,
  Button,
  Col,
  ContextualMenu,
  Icon,
  List,
  Notification,
  Pagination,
  Row,
  Select,
  Spinner,
  Strip,
} from "@canonical/react-components";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { formatErrors } from "./utils";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import TableHeader from "app/base/components/TableHeader";
import { useWindowTitle } from "app/base/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type {
  ListParams,
  MachineFilterGroup,
  MachineList as MachineListType,
  MachineListGroup as MachineListGroupType,
} from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

const DUMMY_FILTER_GROUPS: MachineFilterGroup[] = [
  {
    dynamic: false,
    for_grouping: true,
    key: "power_state",
    label: "Power state",
    options: [
      { key: "error", label: "Error" },
      { key: "off", label: "Off" },
      { key: "on", label: "On" },
      { key: "unknown", label: "Unknown" },
    ],
    optionsLoaded: true,
    optionsLoading: false,
  },
  {
    dynamic: false,
    for_grouping: true,
    key: "status",
    label: "Status",
    options: [],
    optionsLoaded: false,
    optionsLoading: true,
  },
];

const MachineFilters = (): JSX.Element => {
  // const dispatch = useDispatch();
  // const filterGroups = useSelector(machineSelectors.filterGroups);
  // const filterGroupsLoaded = useSelector(machineSelectors.filterGroupsLoaded);
  const [expandedSection, setExpandedSection] = useState<string | undefined>();
  const filterGroups = DUMMY_FILTER_GROUPS;

  return (
    <ContextualMenu
      className="filter-accordion"
      constrainPanelWidth
      hasToggleIcon
      position="left"
      toggleClassName="filter-accordion__toggle"
      // toggleDisabled={!filterGroupsLoaded}
      toggleLabel="Filters"
    >
      <Accordion
        expanded={expandedSection}
        externallyControlled
        onExpandedChange={(groupKey) => {
          setExpandedSection(groupKey);
          // const group = filterGroups.find((group) => group.key === groupKey);
          // if (group && (!group.dynamic || !group.optionsLoaded)) {
          //   dispatch(machineActions.getFilterOptions({ group_key: groupKey }));
          // }
        }}
        sections={filterGroups.map((group) => ({
          content: group.optionsLoading ? (
            <div style={{ padding: "0.5rem" }}>
              <Spinner
                className="u-nudge-right--small"
                text="Loading filter options..."
              />
            </div>
          ) : (
            <List
              className="u-no-margin--bottom"
              items={group.options.map((option) => (
                <Button
                  appearance="base"
                  className="u-align-text--left u-no-margin--bottom filter-accordion__item is-dense"
                  onClick={() => null}
                  role="checkbox"
                >
                  {option.label}
                </Button>
              ))}
            />
          ),
          key: group.key,
          title: group.label,
        }))}
      />
    </ContextualMenu>
  );
};

type GroupSelectProps = {
  currentGroup: string;
  onSelectGroup: (groupKey: string) => void;
};
const GroupSelect = ({
  currentGroup,
  onSelectGroup,
}: GroupSelectProps): JSX.Element => {
  // const filterGroupsLoaded = useSelector(machineSelectors.filterGroupsLoaded);
  // const filtersForGrouping = useSelector(
  //   machineSelectors.getFiltersForGrouping
  // );
  const filtersForGrouping = DUMMY_FILTER_GROUPS;

  return (
    <Select
      // disabled={!filterGroupsLoaded}
      onChange={(e) => {
        onSelectGroup(e.target.value);
      }}
      options={[
        { label: "No grouping", value: "" },
        ...filtersForGrouping.map((group) => ({
          label: `Group by ${group.label}`,
          value: group.key,
        })),
      ]}
      value={currentGroup}
    />
  );
};

type MachineListGroupProps = {
  group: MachineListGroupType;
  onToggleCollapse: (group: MachineListGroupType) => void;
};
const MachineListGroup = ({
  group,
  onToggleCollapse,
}: MachineListGroupProps): JSX.Element => {
  const machinesInGroup = useSelector((state: RootState) =>
    machineSelectors.getByIds(state, group.items)
  );
  const isGrouped = group.name !== null;

  return (
    <>
      {isGrouped && (
        <tr>
          <td colSpan={3}>
            <div className="u-flex">
              <div>
                <strong>{group.name}</strong>
                <small className="u-nudge-right--small u-text--muted">
                  (
                  {group.collapsed
                    ? `${group.count} hidden`
                    : `Showing ${group.items.length} of ${group.count}`}
                  )
                </small>
              </div>
              <div className="u-nudge-right--small">
                <Button
                  appearance="base"
                  dense
                  hasIcon
                  onClick={() => onToggleCollapse(group)}
                  small
                >
                  <Icon name={group.collapsed ? "plus" : "minus"} />
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
      {machinesInGroup.map((machine) => (
        <tr key={machine.system_id}>
          <td>{machine.hostname}</td>
          <td>{machine.power_state}</td>
          <td>{machine.status}</td>
        </tr>
      ))}
    </>
  );
};

type MachineListProps = {
  list: MachineListType;
  listId: string;
};
const MachineList = ({
  list,
  listId,
}: MachineListProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const unsubIds = useSelector((state: RootState) =>
    machineSelectors.getForUnsubscribe(state, listId)
  );
  const unsubscribe = useCallback(() => {
    dispatch(machineActions.unsubscribe({ system_ids: unsubIds }));
  }, [dispatch, unsubIds]);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState<string>("");
  const [groupBy, setGroupBy] = useState<string>("");
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [sort, setSort] = useState<{
    direction: "ascending" | "descending";
    key: string;
  }>({ direction: "ascending", key: "hostname" });
  const listParams: ListParams = {
    group_collapsed: collapsedGroups,
    group_key: groupBy || undefined,
    page_number: list.cur_page,
    page_size: pageSize,
    sort_direction: sort.direction,
    sort_key: sort.key,
  };
  const updateSort = (sortKey: string) => {
    const newSort = {
      direction: (sort.key === sortKey && sort.direction === "ascending"
        ? "descending"
        : "ascending") as "ascending" | "descending",
      key: sortKey,
    };
    setSort(newSort);
    dispatch(
      machineActions.list(listId, {
        ...listParams,
        page_number: 1,
        sort_direction: newSort.direction,
        sort_key: newSort.key,
      })
    );
  };

  return (
    <Strip shallow>
      {list.errors && (
        <Notification severity="negative">
          {formatErrors(list.errors)}
        </Notification>
      )}
      <Row>
        <Col size={3}>
          <DebounceSearchBox
            onDebounced={() => {
              dispatch(
                machineActions.list(listId, {
                  ...listParams,
                  page_number: 1,
                })
              );
              unsubscribe();
            }}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </Col>
        <Col size={3}>
          <MachineFilters />
        </Col>
        <Col size={3}>
          <GroupSelect
            currentGroup={groupBy}
            onSelectGroup={(groupKey) => {
              setCollapsedGroups([]);
              setGroupBy(groupKey);
              dispatch(
                machineActions.list(listId, {
                  ...listParams,
                  group_collapsed: [],
                  group_key: groupKey || undefined,
                  page_number: 1,
                })
              );
              unsubscribe();
            }}
          />
        </Col>
        <Col size={3}>
          <Select
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              dispatch(
                machineActions.list(listId, {
                  ...listParams,
                  page_number: 1,
                  page_size: Number(e.target.value),
                })
              );
              unsubscribe();
            }}
            options={[
              { label: "Show 5 per page", value: "5" },
              { label: "Show 10 per page", value: "10" },
              { label: "Show 20 per page", value: "20" },
            ]}
            value={pageSize}
          />
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          <table>
            <thead>
              <tr>
                <th>
                  <TableHeader
                    currentSort={sort}
                    onClick={() => updateSort("hostname")}
                    sortKey="hostname"
                  >
                    Hostname
                  </TableHeader>
                </th>
                <th>
                  <TableHeader
                    currentSort={sort}
                    onClick={() => updateSort("power_state")}
                    sortKey="power_state"
                  >
                    Power state
                  </TableHeader>
                </th>
                <th>
                  <TableHeader
                    currentSort={sort}
                    onClick={() => updateSort("status")}
                    sortKey="status"
                  >
                    Status
                  </TableHeader>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.loading ? (
                <tr>
                  <td colSpan={3}>
                    <Spinner text="Loading..." />
                  </td>
                </tr>
              ) : (
                <>
                  {list.groups.map((group) => (
                    <MachineListGroup
                      group={group}
                      key={group.name || "No group"}
                      onToggleCollapse={(group) => {
                        if (group.name) {
                          const newCollapsed = collapsedGroups.includes(
                            group.name
                          )
                            ? collapsedGroups.filter(
                                (groupName) => groupName !== group.name
                              )
                            : [...collapsedGroups, group.name];
                          setCollapsedGroups(newCollapsed);
                          dispatch(
                            machineActions.list(listId, {
                              ...listParams,
                              group_collapsed: newCollapsed,
                            })
                          );
                          unsubscribe();
                        }
                      }}
                    />
                  ))}
                </>
              )}
            </tbody>
          </table>
          {list.loaded && (
            <>
              <Pagination
                currentPage={list.cur_page}
                itemsPerPage={pageSize}
                paginate={(page) => {
                  dispatch(
                    machineActions.list(listId, {
                      ...listParams,
                      page_number: page,
                    })
                  );
                  unsubscribe();
                }}
                totalItems={pageSize * list.num_pages}
              />
            </>
          )}
          <div>
            <Button
              appearance="negative"
              onClick={() => {
                dispatch(machineActions.clearList(listId));
                unsubscribe();
              }}
            >
              Remove machine list
            </Button>
          </div>
        </Col>
      </Row>
    </Strip>
  );
};

const SSFTest = (): JSX.Element => {
  const dispatch = useDispatch();
  const count = useSelector(machineSelectors.count);
  const countLoaded = useSelector(machineSelectors.countLoaded);
  const lists = useSelector(machineSelectors.lists);
  useWindowTitle("Server side filtering test");

  useEffect(() => {
    // dispatch(machineActions.getCount());
    // dispatch(machineActions.getFilterGroups());
  }, [dispatch]);

  return (
    <Section header={<SectionHeader title="Server side filtering test" />}>
      <Row>
        <Col size={12}>
          <p>
            There are {countLoaded ? count : <Spinner />} machines in this MAAS.
          </p>
          <Button
            appearance="positive"
            onClick={() => {
              dispatch(
                machineActions.list(nanoid(10), {
                  page_number: 1,
                  page_size: 5,
                  sort_direction: "ascending",
                  sort_key: "hostname",
                })
              );
            }}
          >
            Add machine list
          </Button>
        </Col>
      </Row>
      {Object.entries(lists).map(([listId, list]) => (
        <MachineList key={listId} list={list} listId={listId} />
      ))}
    </Section>
  );
};

export default SSFTest;
