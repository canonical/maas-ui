import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DeviceListHeader from "./DeviceListHeader";

import Section from "app/base/components/Section";
import type { DeviceHeaderContent } from "app/devices/types";
import deviceURLs from "app/devices/urls";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";

const DeviceList = (): JSX.Element => {
  const dispatch = useDispatch();
  const devices = useSelector(deviceSelectors.all);
  const loading = useSelector(deviceSelectors.loading);
  const [headerContent, setHeaderContent] =
    useState<DeviceHeaderContent | null>(null);

  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={
        <DeviceListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
        />
      }
    >
      {!loading && (
        <ul>
          {devices.map((device) => (
            <li key={device.system_id}>
              <Link to={deviceURLs.device.index({ id: device.system_id })}>
                {device.fqdn}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

export default DeviceList;
