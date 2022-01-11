import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { VersionColumn } from "./VersionColumn";

import { ControllerInstallType } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  controllerVersions as controllerVersionsFactory,
  controllerVersionInfo as controllerVersionInfoFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("VersionColumn", () => {
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

  it("can display the current version", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      current: controllerVersionInfoFactory({ version: "1.2.3" }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <VersionColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="version"]').text()).toEqual("1.2.3");
  });

  it("can display an unknown version", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      current: controllerVersionInfoFactory({ version: undefined }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <VersionColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="version"]').text()).toBe("Unknown ");
  });

  it("can display the origin", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      origin: "latest/edge",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <VersionColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="origin"]').text()).toBe("latest/edge ");
  });

  it("can display the origin when it is a deb", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      install_type: ControllerInstallType.DEB,
      origin: "stable",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <VersionColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="origin"]').text()).toBe("Deb ");
    expect(wrapper.find('[data-testid="origin-tooltip"]').prop("message")).toBe(
      "stable"
    );
  });

  it("can display a cohort tooltip", () => {
    state.controller.items[0].versions = controllerVersionsFactory({
      snap_cohort:
        "MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViMUppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNTI3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjVhM2ViNzQwZGZmYzk5OWFiYWU=",
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/controllers", key: "testKey" }]}
        >
          <VersionColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="origin-tooltip"]').prop("message")).toBe(
      "Cohort key: \nMSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViM \nUppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNT \nI3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjV \nhM2ViNzQwZGZmYzk5OWFiYWU="
    );
  });
});
