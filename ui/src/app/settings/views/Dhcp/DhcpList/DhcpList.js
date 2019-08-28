import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import actions from "app/settings/actions";
import {
  controller as controllerActions,
  device as deviceActions,
  machine as machineActions
} from "app/base/actions";
import {
  controller as controllerSelectors,
  device as deviceSelectors,
  machine as machineSelectors
} from "app/base/selectors";
import Loader from "app/base/components/Loader";
import selectors from "app/settings/selectors";

// Temporarily create a item component, this will be replaced with a table.
const DhcpListItem = ({ id, name, node, subnet }) => {
  const subnetItem = useSelector(state =>
    selectors.subnet.getById(state, subnet)
  );
  const controllerItem = useSelector(state =>
    controllerSelectors.getBySystemId(state, node)
  );
  const deviceItem = useSelector(state =>
    deviceSelectors.getBySystemId(state, node)
  );
  const machineItem = useSelector(state =>
    machineSelectors.getBySystemId(state, node)
  );
  const nodeItem = controllerItem || deviceItem || machineItem;
  const nodeType =
    (controllerItem && "controller") ||
    (deviceItem && "device") ||
    (machineItem && "machine");
  return (
    <li>
      {name} {subnet && `(subnet: ${subnetItem.name})`}{" "}
      {nodeItem && `(${nodeType}: ${nodeItem.hostname})`}
    </li>
  );
};

const DhcpList = () => {
  const dhcpsnippetLoading = useSelector(selectors.dhcpsnippet.loading);
  const dhcpsnippetLoaded = useSelector(selectors.dhcpsnippet.loaded);
  const dhcpsnippets = useSelector(selectors.dhcpsnippet.all);
  const subnetLoading = useSelector(selectors.subnet.loading);
  const subnetLoaded = useSelector(selectors.subnet.loaded);
  const controllerLoading = useSelector(controllerSelectors.loading);
  const controllerLoaded = useSelector(controllerSelectors.loaded);
  const deviceLoading = useSelector(deviceSelectors.loading);
  const deviceLoaded = useSelector(deviceSelectors.loaded);
  const machineLoading = useSelector(machineSelectors.loading);
  const machineLoaded = useSelector(machineSelectors.loaded);
  const dispatch = useDispatch();
  const isLoading =
    dhcpsnippetLoading ||
    subnetLoading ||
    controllerLoading ||
    deviceLoading ||
    machineLoading;
  const hasLoaded =
    dhcpsnippetLoaded &&
    subnetLoaded &&
    controllerLoaded &&
    deviceLoaded &&
    machineLoaded;

  useEffect(() => {
    dispatch(actions.dhcpsnippet.fetch());
    dispatch(actions.subnet.fetch());
    dispatch(controllerActions.fetch());
    dispatch(deviceActions.fetch());
    dispatch(machineActions.fetch());
  }, [dispatch]);

  if (isLoading) {
    return <Loader text="Loading..." />;
  }
  const snippets = dhcpsnippets.map(dhcpsnippet => (
    <DhcpListItem {...dhcpsnippet} key={dhcpsnippet.id} />
  ));
  return hasLoaded && <ul>{snippets}</ul>;
};

export default DhcpList;
