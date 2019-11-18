import { Col, Loader, MainTable, Row } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

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

const generateRows = machines =>
  machines.map(machine => {
    if (machine.isGroup) {
      const sortData = {
        [machine.sortKey]: machine.label
      };
      return {
        className: "machine-list__group",
        columns: [
          {
            content: machine.label
          },
          {},
          {},
          {}
        ],
        sortData
      };
    }
    return {
      columns: [
        {
          content: machine.fqdn
        },
        {
          content: machine.status
        },
        {
          content: machine.domain.name
        },
        {
          content: machine.zone.name
        }
      ],
      sortData: {
        cores: machine.cpu_count,
        disks: machine.physical_disk_count,
        domain: machine.domain.name,
        name: machine.fqdn,
        owner: machine.owner,
        pool: machine.pool.name,
        power: machine.power_state,
        ram: machine.memory,
        normalisedStatus: machine.normalisedStatus,
        storage: machine.storage,
        zone: machine.zone.name
      }
    };
  });

const MachineList = () => {
  const dispatch = useDispatch();
  const [currentSort, setSort] = useState("normalisedStatus");
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const machinesLoading = useSelector(machineSelectors.loading);
  machines.forEach(machine => {
    machine.normalisedStatus = normaliseStatus(
      machine.status_code,
      machine.status
    );
  });
  const groupKeys = ["normalisedStatus", "domain", "zone"];
  let groups = [];
  if (groupKeys.includes(currentSort)) {
    const labels = [];
    machines.forEach(machine => {
      let sortKey;
      switch (currentSort) {
        case "domain":
        case "zone":
          sortKey = machine[currentSort].name;
          break;
        default:
          sortKey = machine[currentSort];
      }
      if (!labels.includes(sortKey)) {
        labels.push(sortKey);
      }
    });
    groups = labels.map(label => ({
      label,
      isGroup: true,
      sortKey: currentSort
    }));
  }
  const rows = groups.concat(machines);

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
            className="p-table-expanding--light machine-list"
            defaultSort="normalisedStatus"
            defaultSortDirection="ascending"
            headers={[
              {
                content: "FQDN",
                sortKey: "name"
              },
              {
                content: "Status",
                sortKey: "normalisedStatus"
              },
              {
                content: "Domain",
                sortKey: "domain"
              },
              {
                content: "Zone",
                sortKey: "zone"
              }
            ]}
            onUpdateSort={setSort}
            paginate={150}
            rows={generateRows(rows)}
            sortable
          />
        )}
      </Col>
    </Row>
  );
};

export default MachineList;
