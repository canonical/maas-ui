import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";
import type { Mock } from "vitest";

import { ControllerDetailsTabLabels } from "../../constants";

import ControllerDetails from "./ControllerDetails";

import urls from "@/app/base/urls";
import { controllerActions } from "@/app/store/controller";
import * as factory from "@/testing/factories";
import { userEvent, render, screen } from "@/testing/utils";

const mockStore = configureStore();

beforeEach(() => {
  const scrollToSpy: Mock = vi.fn();
  global.scrollTo = scrollToSpy;
});

afterAll(() => {
  vi.restoreAllMocks();
});

it("gets and sets the controller as active", () => {
  const controller = factory.controller({ system_id: "abc123" });
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
      loaded: true,
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: urls.controllers.controller.index({
              id: controller.system_id,
            }),
          },
        ]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<ControllerDetails />}
              path={`${urls.controllers.controller.index(null)}/*`}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const expectedActions = [
    controllerActions.get(controller.system_id),
    controllerActions.setActive(controller.system_id),
  ];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("unsets active controller and cleans up when unmounting", () => {
  const controller = factory.controller({ system_id: "abc123" });
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
      loaded: true,
      loading: false,
    }),
  });
  const store = mockStore(state);
  const { unmount } = render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: urls.controllers.controller.index({
              id: controller.system_id,
            }),
          },
        ]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<ControllerDetails />}
              path={`${urls.controllers.controller.index(null)}/*`}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  unmount();

  const expectedActions = [
    controllerActions.setActive(null),
    controllerActions.cleanup(),
  ];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) =>
          actualAction.type === expectedAction.type &&
          // Check payload to differentiate "set" and "unset" active actions
          actualAction.payload?.params === expectedAction.payload?.params
      )
    ).toStrictEqual(expectedAction);
  });
});

it("displays a message if the controller does not exist", () => {
  const controller = factory.controller({ system_id: "abc123" });
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
      loaded: true,
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: urls.controllers.controller.index({
              id: "missing-id",
            }),
          },
        ]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<ControllerDetails />}
              path={`${urls.controllers.controller.index(null)}/*`}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText(/Unable to find a controller with id/)
  ).toBeInTheDocument();
});

it("gets and sets the controller as active only once when navigating within the same controller", async () => {
  const controller = factory.controller({ system_id: "abc123" });
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
      loaded: true,
      loading: false,
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: urls.controllers.controller.index({
              id: controller.system_id,
            }),
          },
        ]}
      >
        <CompatRouter>
          <Routes>
            <Route
              element={<ControllerDetails />}
              path={`${urls.controllers.controller.index(null)}/*`}
            />
          </Routes>
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getByRole("link", { name: ControllerDetailsTabLabels.vlans })
  );

  const actualActions = store.getActions();
  const getControllerActions = actualActions.filter(
    (actualAction) =>
      actualAction.type === controllerActions.get(controller.system_id).type
  );
  const setActiveControllerActions = actualActions.filter(
    (actualAction) =>
      actualAction.type ===
      controllerActions.setActive(controller.system_id).type
  );

  expect(getControllerActions).toHaveLength(1);
  expect(setActiveControllerActions).toHaveLength(1);
});
