import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import {
  controller as controllerSelectors,
  device as deviceSelectors,
  machine as machineSelectors
} from "app/base/selectors";
import Link from "app/base/components/Link";
import Loader from "app/base/components/Loader";
import selectors from "app/settings/selectors";

const generateURL = url => `${process.env.REACT_APP_MAAS_URL}/${url}`;

const DhcpTarget = ({ nodeId, subnetId }) => {
  const subnetLoading = useSelector(selectors.subnet.loading);
  const subnetLoaded = useSelector(selectors.subnet.loaded);
  const subnet = useSelector(state =>
    selectors.subnet.getById(state, subnetId)
  );
  const controllerLoading = useSelector(controllerSelectors.loading);
  const controllerLoaded = useSelector(controllerSelectors.loaded);
  const controller = useSelector(state =>
    controllerSelectors.getBySystemId(state, nodeId)
  );
  const deviceLoading = useSelector(deviceSelectors.loading);
  const deviceLoaded = useSelector(deviceSelectors.loaded);
  const device = useSelector(state =>
    deviceSelectors.getBySystemId(state, nodeId)
  );
  const machineLoading = useSelector(machineSelectors.loading);
  const machineLoaded = useSelector(machineSelectors.loaded);
  const machine = useSelector(state =>
    machineSelectors.getBySystemId(state, nodeId)
  );
  const isLoading =
    (subnetId && subnetLoading) ||
    (nodeId && (controllerLoading || deviceLoading || machineLoading));
  const hasLoaded =
    (subnetId && subnetLoaded) ||
    (nodeId && controllerLoaded && deviceLoaded && machineLoaded);

  if (isLoading || !hasLoaded) {
    return <Loader inline className="u-no-margin u-no-padding" />;
  }

  let path =
    (subnet && "subnet") ||
    (controller && "controller") ||
    (device && "device") ||
    (machine && "machine");
  const node = machine || device || controller;
  const name = subnet ? (
    subnet.name
  ) : (
    <>
      {node.hostname}
      <small>.{node.domain.name}</small>
    </>
  );
  const url = generateURL(`#/${path}/${nodeId || subnetId}`);
  return <Link href={url}>{name}</Link>;
};

DhcpTarget.propTypes = {
  nodeId: PropTypes.string,
  subnetId: PropTypes.number
};

export default DhcpTarget;
