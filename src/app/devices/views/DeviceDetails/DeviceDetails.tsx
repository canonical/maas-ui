import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { Route, Routes } from "react-router-dom-v5-compat";

import DeviceConfiguration from "./DeviceConfiguration";
import DeviceDetailsHeader from "./DeviceDetailsHeader";
import DeviceNetwork from "./DeviceNetwork";
import DeviceSummary from "./DeviceSummary";

import ModelNotFound from "app/base/components/ModelNotFound";
import PageContent from "app/base/components/PageContent";
import { useGetURLId } from "app/base/hooks/urls";
import type { SidePanelContextType } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";
import urls from "app/base/urls";
import DeviceHeaderForms from "app/devices/components/DeviceHeaderForms";
import type { DeviceSidePanelContent } from "app/devices/types";
import { getHeaderTitle } from "app/devices/utils";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { DeviceMeta } from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import { actions as tagActions } from "app/store/tag";
import { isId, getRelativeRoute } from "app/utils";

const DeviceDetails = (): JSX.Element => {
  const { sidePanelContent, setSidePanelContent } =
    useSidePanel() as SidePanelContextType<DeviceSidePanelContent>;
  const dispatch = useDispatch();
  const id = useGetURLId(DeviceMeta.PK);
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, id)
  );
  const devicesLoading = useSelector(deviceSelectors.loading);

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
      <ModelNotFound id={id} linkURL={urls.devices.index} modelName="device" />
    );
  }

  const base = urls.devices.device.index(null);
  return (
    <PageContent
      header={
        <DeviceDetailsHeader
          setSidePanelContent={setSidePanelContent}
          systemId={id}
        />
      }
      sidePanelContent={
        sidePanelContent &&
        device && (
          <DeviceHeaderForms
            devices={[device]}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
            viewingDetails
          />
        )
      }
      sidePanelTitle={getHeaderTitle(device?.fqdn || "", sidePanelContent)}
    >
      {device && (
        <Routes>
          <Route
            element={<DeviceSummary systemId={id} />}
            path={getRelativeRoute(urls.devices.device.summary(null), base)}
          />
          <Route
            element={<DeviceNetwork systemId={id} />}
            path={getRelativeRoute(urls.devices.device.network(null), base)}
          />
          <Route
            element={<DeviceConfiguration systemId={id} />}
            path={getRelativeRoute(
              urls.devices.device.configuration(null),
              base
            )}
          />
          <Route
            element={<Redirect to={urls.devices.device.summary({ id })} />}
            path="/"
          />
        </Routes>
      )}
    </PageContent>
  );
};

export default DeviceDetails;
