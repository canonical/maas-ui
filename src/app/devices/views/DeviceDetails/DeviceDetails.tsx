import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import DeviceConfiguration from "./DeviceConfiguration";
import DeviceDetailsHeader from "./DeviceDetailsHeader";
import DeviceNetwork from "./DeviceNetwork";
import DeviceSummary from "./DeviceSummary";

import ModelNotFound from "@/app/base/components/ModelNotFound";
import PageContent from "@/app/base/components/PageContent";
import { useGetURLId } from "@/app/base/hooks/urls";
import { useSidePanel } from "@/app/base/side-panel-context";
import urls from "@/app/base/urls";
import DeviceHeaderForms from "@/app/devices/components/DeviceHeaderForms";
import DeviceNetworkForms from "@/app/devices/components/DeviceNetworkForms";
import { deviceActions } from "@/app/store/device";
import deviceSelectors from "@/app/store/device/selectors";
import { DeviceMeta } from "@/app/store/device/types";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import { getSidePanelTitle } from "@/app/store/utils/node/base";
import { isId, getRelativeRoute } from "@/app/utils";

const DeviceDetails = (): JSX.Element => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
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
  return device ? (
    <Routes>
      <Route
        element={
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
            sidePanelTitle={getSidePanelTitle(
              device?.fqdn || "",
              sidePanelContent
            )}
          >
            <DeviceSummary systemId={id} />
          </PageContent>
        }
        path={getRelativeRoute(urls.devices.device.summary(null), base)}
      />
      <Route
        element={
          <PageContent
            header={
              <DeviceDetailsHeader
                setSidePanelContent={setSidePanelContent}
                systemId={id}
              />
            }
            sidePanelContent={
              sidePanelContent && (
                <DeviceNetworkForms
                  setSidePanelContent={setSidePanelContent}
                  sidePanelContent={sidePanelContent}
                  systemId={id}
                />
              )
            }
            sidePanelTitle={getSidePanelTitle(
              device?.fqdn || "",
              sidePanelContent
            )}
          >
            <DeviceNetwork systemId={id} />
          </PageContent>
        }
        path={getRelativeRoute(urls.devices.device.network(null), base)}
      />
      <Route
        element={
          <PageContent
            header={
              <DeviceDetailsHeader
                setSidePanelContent={setSidePanelContent}
                systemId={id}
              />
            }
            sidePanelContent={null}
            sidePanelTitle={null}
          >
            <DeviceConfiguration systemId={id} />
          </PageContent>
        }
        path={getRelativeRoute(urls.devices.device.configuration(null), base)}
      />
      <Route
        element={<Redirect to={urls.devices.device.summary({ id })} />}
        path="/"
      />
    </Routes>
  ) : (
    <></>
  );
};

export default DeviceDetails;
