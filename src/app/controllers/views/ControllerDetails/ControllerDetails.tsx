import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import ControllerCommissioning from "./ControllerCommissioning";
import ControllerConfiguration from "./ControllerConfiguration";
import ControllerDetailsHeader from "./ControllerDetailsHeader";
import ControllerLogs from "./ControllerLogs";
import ControllerNetwork from "./ControllerNetwork";
import ControllerPCIDevices from "./ControllerPCIDevices";
import ControllerStorage from "./ControllerStorage";
import ControllerSummary from "./ControllerSummary";
import ControllerUSBDevices from "./ControllerUSBDevices";
import ControllerVLANs from "./ControllerVLANs";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import NodeTestDetails from "app/base/components/node/NodeTestDetails";
import { useGetURLId } from "app/base/hooks/urls";
import urls from "app/base/urls";
import type { ControllerHeaderContent } from "app/controllers/types";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import { ControllerMeta } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

const ControllerDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const id = useGetURLId(ControllerMeta.PK);
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, id)
  );
  const controllersLoading = useSelector(controllerSelectors.loading);
  const [headerContent, setHeaderContent] =
    useState<ControllerHeaderContent | null>(null);

  useEffect(() => {
    if (isId(id)) {
      // Set active controller on load to ensure all controller details are sent
      // through the websocket.
      dispatch(controllerActions.get(id));
      dispatch(controllerActions.setActive(id));
    }
    // Unset active controller and cleanup state on unmount.
    return () => {
      dispatch(controllerActions.setActive(null));
      dispatch(controllerActions.cleanup());
    };
  }, [dispatch, id]);

  if (!isId(id) || (!controllersLoading && !controller)) {
    return (
      <ModelNotFound
        id={id}
        linkURL={urls.controllers.index}
        modelName="controller"
      />
    );
  }

  return (
    <Section
      header={
        <ControllerDetailsHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          systemId={id}
        />
      }
    >
      {controller && (
        <Switch>
          <Route
            exact
            path={urls.controllers.controller.summary(null)}
            render={() => <ControllerSummary systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.vlans(null)}
            render={() => <ControllerVLANs systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.network(null)}
            render={() => <ControllerNetwork systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.storage(null)}
            render={() => <ControllerStorage systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.pciDevices(null)}
            render={() => <ControllerPCIDevices systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.usbDevices(null)}
            render={() => <ControllerUSBDevices systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.commissioning.index(null)}
            render={() => <ControllerCommissioning systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.commissioning.scriptResult(null)}
            render={() => (
              <NodeTestDetails
                getReturnPath={(id) =>
                  urls.controllers.controller.commissioning.index({ id })
                }
              />
            )}
          />
          <Route
            exact
            path={urls.controllers.controller.logs.index(null)}
            render={() => <ControllerLogs systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.logs.events(null)}
            render={() => <ControllerLogs systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.logs.installationOutput(null)}
            render={() => <ControllerLogs systemId={id} />}
          />
          <Route
            exact
            path={urls.controllers.controller.configuration(null)}
            render={() => <ControllerConfiguration systemId={id} />}
          />
          <Redirect
            from={urls.controllers.controller.index(null)}
            to={urls.controllers.controller.summary(null)}
          />
        </Switch>
      )}
    </Section>
  );
};

export default ControllerDetails;
