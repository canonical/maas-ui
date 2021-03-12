import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddLxd from "./AddLxd";

import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  podProject as podProjectFactory,
  podState as podStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddLxd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "maas_name", value: "MAAS" }],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              name: PodType.LXD,
              fields: [
                powerFieldFactory({ name: "power_address" }),
                powerFieldFactory({ name: "password" }),
              ],
            }),
          ],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory()],
        loaded: true,
      }),
    });
  });

  it("can handle fetching projects for a given LXD server address", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddLxd setKvmType={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("Formik").prop("onSubmit")({
        name: "my-favourite-kvm",
        pool: 0,
        power_address: "192.168.1.1",
        password: "password",
        project: "default",
        zone: 0,
      });
    });
    wrapper.update();

    expect(
      store.getActions().find((action) => action.type === "pod/getProjects")
    ).toStrictEqual({
      type: "pod/getProjects",
      meta: {
        method: "get_projects",
        model: "pod",
      },
      payload: {
        params: {
          power_address: "192.168.1.1",
          password: "password",
          type: "lxd",
        },
      },
    });
  });

  it("can handle saving a LXD KVM once projects have been fetched", () => {
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddLxd setKvmType={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    // Fetch projects
    act(() => {
      wrapper.find("Formik").prop("onSubmit")({
        name: "my-favourite-kvm",
        pool: 0,
        power_address: "192.168.1.1",
        password: "password",
        project: "",
        zone: 0,
      });
    });
    wrapper.update();

    // Submit again
    act(() => {
      wrapper.find("Formik").prop("onSubmit")({
        name: "my-favourite-kvm",
        pool: 0,
        power_address: "192.168.1.1",
        password: "password",
        project: "default",
        zone: 0,
      });
    });
    wrapper.update();

    expect(
      store.getActions().find((action) => action.type === "pod/create")
    ).toStrictEqual({
      type: "pod/create",
      meta: {
        method: "create",
        model: "pod",
      },
      payload: {
        params: {
          name: "my-favourite-kvm",
          pool: 0,
          power_address: "192.168.1.1",
          password: "password",
          project: "default",
          type: "lxd",
          zone: 0,
        },
      },
    });
  });
});
