import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ControllerStatusCard, { Labels } from "./ControllerStatusCard";

import { actions as controllerActions } from "app/store/controller";
import {
  ControllerInstallType,
  ImageSyncStatus,
} from "app/store/controller/types";
import { NodeType } from "app/store/types/node";
import {
  controllerDetails as controllerDetailsFactory,
  controllerImageSyncStatuses as controllerImageSyncStatusesFactory,
  controllerState as controllerStateFactory,
  controllerStatus as controllerStatusFactory,
  controllerStatuses as controllerStatusesFactory,
  controllerVersionInfo as controllerVersionInfoFactory,
  controllerVersions as controllerVersionsFactory,
  generalState as generalStateFactory,
  osInfo as osInfoFactory,
  osInfoState as osInfoStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("dispatches an action to poll images if controller is a rack or region+rack", () => {
  const controller = controllerDetailsFactory({
    node_type: NodeType.RACK_CONTROLLER,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(
    store
      .getActions()
      .some(
        (action) =>
          action.type ===
          controllerActions.pollCheckImages([controller.system_id], "").type
      )
  );
});

it("does not dispatch an action to poll images if controller is a region controller", () => {
  const controller = controllerDetailsFactory({
    node_type: NodeType.REGION_CONTROLLER,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(
    store
      .getActions()
      .every(
        (action) =>
          action.type !==
          controllerActions.pollCheckImages([controller.system_id], "").type
      )
  );
});

it("dispatches an action to stop polling images on unmount", () => {
  const controller = controllerDetailsFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  const { unmount } = render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  unmount();

  expect(
    store
      .getActions()
      .some(
        (action) =>
          action.type === controllerActions.pollCheckImagesStop("").type
      )
  );
});

it("renders correct version info for a deb install", () => {
  const controller = controllerDetailsFactory({
    versions: controllerVersionsFactory({
      current: controllerVersionInfoFactory({ version: "1.2.3" }),
      install_type: ControllerInstallType.DEB,
      origin: "ppa:some/ppa",
    }),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByLabelText(Labels.Version).textContent).toBe(
    "Version: 1.2.3"
  );
  expect(screen.getByLabelText(Labels.Origin).textContent).toBe(
    "Deb: ppa:some/ppa"
  );
});

it("renders correct version info for a snap install", () => {
  const controller = controllerDetailsFactory({
    versions: controllerVersionsFactory({
      current: controllerVersionInfoFactory({ version: "1.2.3" }),
      install_type: ControllerInstallType.SNAP,
      origin: "1.2/edge",
    }),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByLabelText(Labels.Version).textContent).toBe(
    "Version: 1.2.3"
  );
  expect(screen.getByLabelText(Labels.Origin).textContent).toBe(
    "Channel: 1.2/edge"
  );
});

it("renders correct version info for an unknown install type", () => {
  const controller = controllerDetailsFactory({
    versions: controllerVersionsFactory({
      current: controllerVersionInfoFactory({ version: "" }),
      install_type: ControllerInstallType.UNKNOWN,
      origin: "nowhere",
    }),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByLabelText(Labels.Version).textContent).toBe(
    "Version: Unknown (less than 2.3.0)"
  );
  expect(screen.getByLabelText(Labels.Origin).textContent).toBe(
    "Origin: nowhere"
  );
});

it("renders OS info", () => {
  const controller = controllerDetailsFactory({
    distro_series: "focal",
    osystem: "ubuntu",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
    general: generalStateFactory({
      osInfo: osInfoStateFactory({
        data: osInfoFactory({
          releases: [["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"']],
        }),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByLabelText(Labels.OSInfo).textContent).toBe(
    'Ubuntu 20.04 LTS "Focal Fossa"'
  );
});

it("shows image sync status for rack or region+rack controllers", () => {
  const controller = controllerDetailsFactory({
    node_type: NodeType.RACK_CONTROLLER,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByLabelText(Labels.ImageSyncStatus)).toBeInTheDocument();
});

it("can render when no image sync status exists", () => {
  const controller = controllerDetailsFactory({
    node_type: NodeType.RACK_CONTROLLER,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      imageSyncStatuses: controllerImageSyncStatusesFactory(),
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByText(Labels.NoStatus)).toBeInTheDocument();
});

it("can render when image status is synced", () => {
  const controller = controllerDetailsFactory({
    node_type: NodeType.RACK_CONTROLLER,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      imageSyncStatuses: controllerImageSyncStatusesFactory({
        [controller.system_id]: ImageSyncStatus.Synced,
      }),
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByLabelText(Labels.ImagesSynced)).toBeInTheDocument();
});

it("can render when checking image status", () => {
  const controller = controllerDetailsFactory({
    node_type: NodeType.RACK_CONTROLLER,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      imageSyncStatuses: controllerImageSyncStatusesFactory({
        [controller.system_id]: ImageSyncStatus.Synced,
      }),
      items: [controller],
      statuses: controllerStatusesFactory({
        [controller.system_id]: controllerStatusFactory({
          checkingImages: true,
        }),
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(screen.getByText(Labels.CheckingImages)).toBeInTheDocument();
});

it("does not show image sync status for region controllers", () => {
  const controller = controllerDetailsFactory({
    node_type: NodeType.REGION_CONTROLLER,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <ControllerStatusCard controller={controller} />
    </Provider>
  );

  expect(
    screen.queryByLabelText(Labels.ImageSyncStatus)
  ).not.toBeInTheDocument();
});
