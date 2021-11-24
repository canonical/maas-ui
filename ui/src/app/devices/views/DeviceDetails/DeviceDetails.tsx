import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";

import DeviceConfiguration from "./DeviceConfiguration";
import DeviceDetailsHeader from "./DeviceDetailsHeader";
import DeviceNetwork from "./DeviceNetwork";
import DeviceSummary from "./DeviceSummary";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import type { RouteParams } from "app/base/types";
import type { DeviceHeaderContent } from "app/devices/types";
import deviceURLs from "app/devices/urls";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { RootState } from "app/store/root/types";

const DeviceDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, id)
  );
  const devicesLoading = useSelector(deviceSelectors.loading);
  const [headerContent, setHeaderContent] =
    useState<DeviceHeaderContent | null>(null);

  // TODO: Replace with "get" method when implemented
  // https://github.com/canonical-web-and-design/app-tribe/issues/520
  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  if (!devicesLoading && !device) {
    return (
      <ModelNotFound
        id={id}
        linkURL={deviceURLs.devices.index}
        modelName="device"
      />
    );
  }

  return (
    <Section
      header={
        <DeviceDetailsHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          systemId={id}
        />
      }
    >
      {device && (
        <Switch>
          <Route exact path={deviceURLs.device.summary(null, true)}>
            <DeviceSummary />
          </Route>
          <Route exact path={deviceURLs.device.network(null, true)}>
            <DeviceNetwork />
          </Route>
          <Route exact path={deviceURLs.device.configuration(null, true)}>
            <DeviceConfiguration />
          </Route>
          <Redirect
            from={deviceURLs.device.index(null, true)}
            to={deviceURLs.device.summary(null, true)}
          />
        </Switch>
      )}
    </Section>
  );
};

export default DeviceDetails;
