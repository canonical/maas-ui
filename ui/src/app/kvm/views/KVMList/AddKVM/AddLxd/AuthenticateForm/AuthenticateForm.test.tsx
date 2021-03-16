import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AuthenticateForm from "./AuthenticateForm";

import type { RootState } from "app/store/root/types";
import {
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AuthenticateForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
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
    const setAuthValues = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AuthenticateForm
            setAuthValues={setAuthValues}
            setKvmType={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("Formik").prop("onSubmit")({
        name: "my-favourite-kvm",
        pool: 0,
        power_address: "192.168.1.1",
        password: "password",
        zone: 0,
      });
    });
    wrapper.update();

    expect(setAuthValues).toHaveBeenCalledWith({
      name: "my-favourite-kvm",
      password: "password",
      pool: 0,
      power_address: "192.168.1.1",
      zone: 0,
    });
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
});
