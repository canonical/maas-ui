import { Route, Switch } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import devicesURLs from "app/devices/urls";

const Devices = (): JSX.Element => {
  return (
    <Switch>
      <Route exact path={[devicesURLs.devices.index]}>
        Devices
      </Route>
      <Route
        exact
        path={[
          devicesURLs.device.configuration(null, true),
          devicesURLs.device.index(null, true),
          devicesURLs.device.network(null, true),
          devicesURLs.device.summary(null, true),
        ]}
      >
        Device
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Devices;
