import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import { useWindowTitle } from "app/base/hooks";
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import Row from "app/base/components/Row";

const generateRows = machines =>
  machines.map(machine => ({
    columns: [
      {
        content: machine.fqdn
      }
    ],
    sortData: {
      name: machine.fqdn,
      power: machine.power_state,
      status: machine.status,
      owner: machine.owner,
      pool: machine.pool.name,
      zone: machine.zone.name,
      cores: machine.cpu_count,
      ram: machine.memory,
      disks: machine.physical_disk_count,
      storage: machine.storage
    }
  }));

const MachineList = () => {
  const dispatch = useDispatch();
  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const machinesLoading = useSelector(machineSelectors.loading);

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
            className="p-table-expanding--light"
            defaultSort="status"
            defaultSortDirection="ascending"
            headers={[
              {
                content: "FQDN",
                sortKey: "name"
              }
            ]}
            paginate={150}
            rows={generateRows(machines)}
            sortable
          />
        )}
      </Col>
    </Row>
  );
};

export default MachineList;
