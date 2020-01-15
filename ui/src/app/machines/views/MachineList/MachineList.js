import {
  Button,
  Col,
  Loader,
  MainTable,
  Row
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import pluralize from "pluralize";

import "./MachineList.scss";
import {
  general as generalActions,
  machine as machineActions,
  resourcepool as resourcePoolActions,
  scripts as scriptActions,
  service as serviceActions,
  tag as tagActions,
  user as userActions,
  zone as zoneActions
} from "app/base/actions";
import { machine as machineSelectors } from "app/base/selectors";
import { nodeStatus } from "app/base/enum";
import { useWindowTitle } from "app/base/hooks";
import { formatGigabytes, formatGigabits } from "app/utils";
import DisksColumn from "./DisksColumn";
import FabricColumn from "./FabricColumn";
import NameColumn from "./NameColumn";
import OwnerColumn from "./OwnerColumn";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import ZoneColumn from "./ZoneColumn";

const normaliseStatus = (statusCode, status) => {
  switch (statusCode) {
    case nodeStatus.FAILED_COMMISSIONING:
    case nodeStatus.FAILED_DEPLOYMENT:
    case nodeStatus.FAILED_RELEASING:
    case nodeStatus.FAILED_DISK_ERASING:
    case nodeStatus.FAILED_ENTERING_RESCUE_MODE:
    case nodeStatus.FAILED_EXITING_RESCUE_MODE:
    case nodeStatus.FAILED_TESTING:
      return "Failed";
    case nodeStatus.RESCUE_MODE:
    case nodeStatus.ENTERING_RESCUE_MODE:
    case nodeStatus.EXITING_RESCUE_MODE:
      return "Rescue mode";
    case nodeStatus.RELEASING:
    case nodeStatus.DISK_ERASING:
      return "Releasing";
    case nodeStatus.RETIRED:
    case nodeStatus.MISSING:
    case nodeStatus.RESERVED:
      return "Other";
    default:
      return status;
  }
};

const getSortValue = (machine, currentSort) => {
  switch (currentSort) {
    case "domain":
    case "zone":
      return machine[currentSort].name;
    default:
      return machine[currentSort];
  }
};

const generateRows = (rows, hiddenGroups, setHiddenGroups) =>
  rows.map(row => {
    if (row.isGroup) {
      const sortData = {
        [row.sortKey]: row.label
      };
      const collapsed = hiddenGroups.includes(row.label);
      return {
        className: "machine-list__group",
        columns: [
          {
            content: (
              <>
                <strong>{row.label}</strong>
                <div className="u-text--light">{`
                ${row.count} ${pluralize("machine", row.count)}`}</div>
              </>
            )
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {
            className: "machine-list__group-toggle",
            content: (
              <Button
                appearance="base"
                className="machine-list__group-toggle-button"
                onClick={() => {
                  if (collapsed) {
                    setHiddenGroups(
                      hiddenGroups.filter(group => group !== row.label)
                    );
                  } else {
                    setHiddenGroups(hiddenGroups.concat([row.label]));
                  }
                }}
              >
                {collapsed ? (
                  <i className="p-icon--plus">Show</i>
                ) : (
                  <i className="p-icon--minus">Hide</i>
                )}
              </Button>
            )
          }
        ],
        sortData
      };
    }
    return {
      className: "machine-list__machine",
      columns: [
        {
          content: <NameColumn showMAC={false} systemId={row.system_id} />
        },
        {
          content: <PowerColumn systemId={row.system_id} />
        },
        {
          content: row.status
        },
        {
          content: <OwnerColumn systemId={row.system_id} />
        },
        {
          content: <PoolColumn systemId={row.system_id} />
        },
        {
          content: <ZoneColumn systemId={row.system_id} />
        },
        {
          content: <FabricColumn systemId={row.system_id} />
        },
        {
          content: row.cpu_count,
          className: "u-align--right"
        },
        {
          content: formatGigabits(row.memory),
          className: "u-align--right"
        },
        {
          content: <DisksColumn systemId={row.system_id} />
        },
        {
          content: formatGigabytes(row.storage),
          className: "u-align--right"
        }
      ],
      sortData: {
        cores: row.cpu_count,
        disks: row.physical_disk_count,
        domain: row.domain.name,
        name: row.fqdn,
        owner: row.owner,
        pool: row.pool.name,
        power: row.power_state,
        ram: row.memory,
        normalisedStatus: row.normalisedStatus,
        storage: row.storage,
        zone: row.zone.name
      }
    };
  });

const MachineList = () => {
  const defaultSort = "normalisedStatus";
  const dispatch = useDispatch();
  const [currentSort, setSort] = useState(defaultSort);
  const [hiddenGroups, setHiddenGroups] = useState([]);
  const lastSort = useRef(defaultSort);
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const machinesLoading = useSelector(machineSelectors.loading);
  const normalisedMachines = machines.map(machine => ({
    ...machine,
    normalisedStatus: normaliseStatus(machine.status_code, machine.status)
  }));
  const groupKeys = ["normalisedStatus", "domain", "zone"];
  let groups = [];
  const grouped = groupKeys.includes(currentSort);
  if (grouped) {
    const labels = {};
    normalisedMachines.forEach(machine => {
      const sortKey = getSortValue(machine, currentSort);
      if (labels[sortKey]) {
        labels[sortKey].count += 1;
      } else {
        labels[sortKey] = {
          count: 1,
          isGroup: true,
          label: sortKey,
          sortKey: currentSort
        };
      }
    });
    groups = Object.keys(labels).map(label => labels[label]);
  }
  const visibleMachines = normalisedMachines.filter(machine => {
    return !hiddenGroups.includes(getSortValue(machine, currentSort));
  });
  const rows = groups.concat(visibleMachines);

  const updateSort = newSort => {
    // Reset the hidden groups if the sort changes.
    if (newSort !== lastSort.current) {
      setHiddenGroups([]);
      lastSort.current = newSort;
    }
    setSort(newSort);
  };

  useWindowTitle("Machines");

  useEffect(() => {
    dispatch(generalActions.fetchArchitectures());
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchHweKernels());
    dispatch(generalActions.fetchMachineActions());
    dispatch(generalActions.fetchOsInfo());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(generalActions.fetchVersion());
    dispatch(machineActions.fetch());
    dispatch(resourcePoolActions.fetch());
    dispatch(scriptActions.fetch());
    dispatch(serviceActions.fetch());
    dispatch(tagActions.fetch());
    dispatch(userActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch, machinesLoaded]);

  return (
    <Row>
      <Col size={12}>
        {machinesLoading && (
          <div className="u-align--center">
            <Loader text="Loading..." />
          </div>
        )}
        {machinesLoaded && (
          <MainTable
            className={classNames("p-table-expanding--light", "machine-list", {
              "machine-list--grouped": grouped
            })}
            defaultSort={defaultSort}
            defaultSortDirection="ascending"
            headers={[
              {
                content: "FQDN | MAC",
                sortKey: "name"
              },
              {
                content: (
                  <span className="p-double-row__icon-space">Power</span>
                ),
                sortKey: "power_state"
              },
              {
                content: "Status",
                sortKey: "normalisedStatus"
              },
              {
                content: "Owner",
                sortKey: "owner"
              },
              {
                content: "Pool",
                sortkey: "pool.name"
              },
              {
                content: "Zone",
                sortKey: "zone"
              },
              {
                content: "Fabric",
                sortKey: "vlan.fabric_name"
              },
              {
                content: "Cores",
                sortKey: "cpu_count",
                className: "u-align--right"
              },
              {
                content: "RAM",
                sortKey: "memory",
                className: "u-align--right"
              },
              {
                content: "Disks",
                sortKey: "physical_disk_count",
                className: "u-align--right"
              },
              {
                content: "Storage",
                sortKey: "storage",
                className: "u-align--right"
              }
            ]}
            onUpdateSort={updateSort}
            paginate={150}
            rows={generateRows(rows, hiddenGroups, setHiddenGroups)}
            sortable
          />
        )}
      </Col>
    </Row>
  );
};

export default MachineList;
