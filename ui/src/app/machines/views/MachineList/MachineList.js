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
import Col from "app/base/components/Col";
import Loader from "app/base/components/Loader";
import Row from "app/base/components/Row";

const DnsForm = () => {
  const dispatch = useDispatch();

  const machines = useSelector(machineSelectors.all);
  const machinesLoaded = useSelector(machineSelectors.loaded);
  const machinesLoading = useSelector(machineSelectors.loading);

  useEffect(() => {
    if (!machinesLoaded) {
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
    }
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
          <ul className="p-list">
            {machines.map(machine => (
              <li className="p-list__item" key={machine.fqdn}>
                {machine.fqdn}
              </li>
            ))}
          </ul>
        )}
      </Col>
    </Row>
  );
};

export default DnsForm;
