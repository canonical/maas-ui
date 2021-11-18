import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import DeviceConfiguration from "./DeviceConfiguration";
import DeviceNetwork from "./DeviceNetwork";
import DeviceSummary from "./DeviceSummary";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import type { RouteParams } from "app/base/types";
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

  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  return (
    <Section header={<SectionHeader loading={!device} title={device?.fqdn} />}>
      {device && (
        <>
          <ul>
            <li>
              <Link to={deviceURLs.device.summary({ id: device.system_id })}>
                Summary
              </Link>
            </li>
            <li>
              <Link to={deviceURLs.device.network({ id: device.system_id })}>
                Network
              </Link>
            </li>
            <li>
              <Link
                to={deviceURLs.device.configuration({ id: device.system_id })}
              >
                Configuration
              </Link>
            </li>
          </ul>
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
        </>
      )}
    </Section>
  );
};

export default DeviceDetails;
