import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { StatusColumn } from "./StatusColumn";

import { ControllerVersionIssues } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVersions as controllerVersionsFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("StatusColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      controller: controllerStateFactory({
        loaded: true,
        items: [
          controllerFactory({
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("displays a warning if there is a version error", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      issues: [ControllerVersionIssues.DIFFERENT_CHANNEL],
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="version-error"]').exists()).toBe(true);
  });

  it("displays the controller status if there are no errors", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <StatusColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("ControllerStatus").exists()).toBe(true);
  });
});
