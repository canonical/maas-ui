import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import deviceURLs from "app/devices/urls";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type { Device, DeviceMeta } from "app/store/device/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId?: Device[DeviceMeta.PK] | null;
};

const DeviceLink = ({ systemId }: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const devicesLoading = useSelector(deviceSelectors.loading);

  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  if (devicesLoading) {
    return <Spinner aria-label="Loading devices" />;
  }
  if (!device) {
    return null;
  }
  return (
    <Link to={deviceURLs.device.index({ id: device.system_id })}>
      <strong>{device.hostname}</strong>
      <span>.{device.domain.name}</span>
    </Link>
  );
};

export default DeviceLink;
