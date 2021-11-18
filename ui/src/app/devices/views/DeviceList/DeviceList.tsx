import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Section from "app/base/components/Section";
import SectionHeader from "app/base/components/SectionHeader";
import deviceURLs from "app/devices/urls";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";

const DeviceList = (): JSX.Element => {
  const dispatch = useDispatch();
  const devices = useSelector(deviceSelectors.all);
  const loading = useSelector(deviceSelectors.loading);

  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  return (
    <Section
      header={<SectionHeader subtitleLoading={loading} title="Devices" />}
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
