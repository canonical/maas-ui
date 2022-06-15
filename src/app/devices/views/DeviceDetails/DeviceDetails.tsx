import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { Route, Routes } from "react-router-dom-v5-compat";

import DeviceConfiguration from "./DeviceConfiguration";
import DeviceDetailsHeader from "./DeviceDetailsHeader";
import DeviceNetwork from "./DeviceNetwork";
import DeviceSummary from "./DeviceSummary";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useGetURLId } from "app/base/hooks/urls";
import type { DeviceHeaderContent } from "app/devices/types";
import deviceURLs from "app/devices/urls";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { DeviceMeta } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { getRelativeRoute, isId } from "app/utils";

const DeviceDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(DeviceMeta.PK);

  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, id)
  );
  const devicesLoading = useSelector(deviceSelectors.loading);
  const [headerContent, setHeaderContent] =
    useState<DeviceHeaderContent | null>(null);

  useEffect(() => {
    if (isId(id)) {
      // Set active device on load to ensure all device details are sent through
      // the websocket.
      dispatch(deviceActions.get(id));
      dispatch(deviceActions.setActive(id));
      dispatch(tagActions.fetch());
    }
    // Unset active device and cleanup state on unmount.
    return () => {
      dispatch(deviceActions.setActive(null));
      dispatch(deviceActions.cleanup());
    };
  }, [dispatch, id]);

  if (!isId(id) || (!devicesLoading && !device)) {
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
        <Routes>
          <Route
            path={getRelativeRoute(deviceURLs.device, "summary")}
            element={<DeviceSummary systemId={id} />}
          />
          <Route
            path={getRelativeRoute(deviceURLs.device, "network")}
            element={<DeviceNetwork systemId={id} />}
          />
          <Route
            path={getRelativeRoute(deviceURLs.device, "configuration")}
            element={<DeviceConfiguration systemId={id} />}
          />
          <Route
            path={getRelativeRoute(deviceURLs.device)}
            element={<Redirect to={deviceURLs.device.summary({ id })} />}
          />
        </Routes>
      )}
    </Section>
  );
};

export default DeviceDetails;
