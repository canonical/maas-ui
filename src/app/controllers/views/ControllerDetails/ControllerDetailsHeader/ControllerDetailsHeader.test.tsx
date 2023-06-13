import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import ControllerDetailsHeader from "./ControllerDetailsHeader";

import type { ControllerActions } from "app/store/controller/types";
import { NodeActions } from "app/store/types/node";
import { getNodeActionTitle } from "app/store/utils";
import {
  controller as controllerFactory,
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { userEvent, render, screen } from "testing/utils";

const mockStore = configureStore();

it("displays a spinner as the title if controller has not loaded yet", () => {
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerDetailsHeader
            setSidePanelContent={jest.fn()}
            systemId="abc123"
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByTestId("section-header-title-spinner")
  ).toBeInTheDocument();
});

it("displays a spinner as the subtitle if loaded controller is not the detailed type", () => {
  const controller = controllerFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerDetailsHeader
            setSidePanelContent={jest.fn()}
            systemId={controller.system_id}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByTestId("section-header-subtitle-spinner")
  ).toBeInTheDocument();
});

it("displays the controller's FQDN once loaded and detailed type", () => {
  const controllerDetails = controllerDetailsFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controllerDetails],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerDetailsHeader
            setSidePanelContent={jest.fn()}
            systemId={controllerDetails.system_id}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByRole("heading", { name: controllerDetails.fqdn })
  ).toBeInTheDocument();
});

it("displays actions in take action menu", async () => {
  const actions: ControllerActions[] = [
    NodeActions.SET_ZONE,
    NodeActions.IMPORT_IMAGES,
    NodeActions.DELETE,
  ];
  const controllerDetails = controllerDetailsFactory({
    actions,
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controllerDetails],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <ControllerDetailsHeader
            setSidePanelContent={jest.fn()}
            systemId={controllerDetails.system_id}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const actionLabels = actions.map(getNodeActionTitle);

  actionLabels.forEach((name) => {
    expect(
      screen.queryByRole("button", { name: new RegExp(name) })
    ).not.toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole("button", { name: "Take action" }));

  actionLabels.forEach((name) => {
    expect(
      screen.getByRole("button", { name: new RegExp(name) })
    ).toBeInTheDocument();
  });
});
