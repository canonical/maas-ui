import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter, Route, Routes } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { ControllerDetailsTabLabels } from "../constants";

import Controllers from "./Controllers";

import urls from "app/base/urls";
import { actions as controllerActions } from "app/store/controller";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("Controllers", () => {
  [
    {
      component: "ControllerList",
      path: urls.controllers.index,
    },
    {
      component: "NotFound",
      path: `${urls.controllers.index}/not/a/path`,
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <CompatRouter>
              <Routes>
                <Route
                  element={<Controllers />}
                  path={`${urls.controllers.index}/*`}
                />
              </Routes>
            </CompatRouter>
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});

it("gets and sets the controller as active only once when navigating within the same controller", async () => {
  const controller = controllerFactory({ system_id: "abc123" });
  const state = rootStateFactory({
    controller: controllerStateFactory({
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
              element={<Controllers />}
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
