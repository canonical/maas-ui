import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeviceName from "./DeviceName";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  deviceDetails as deviceDetailsFactory,
  deviceState as deviceStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("DeviceName", () => {
  let state: RootState;
  const domain = domainFactory({ id: 99 });
  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [domain],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory()],
        }),
      }),
      device: deviceStateFactory({
        loaded: true,
        items: [
          deviceDetailsFactory({
            domain,
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can update a device with the new name and domain", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/device/abc123", key: "testKey" }]}
        >
          <DeviceName
            editingName={true}
            id="abc123"
            setEditingName={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    act(() =>
      submitFormikForm(wrapper, {
        hostname: "new-lease",
        domain: "99",
      })
    );
    expect(
      store.getActions().find((action) => action.type === "device/update")
    ).toStrictEqual({
      type: "device/update",
      payload: {
        params: {
          domain: domain,
          hostname: "new-lease",
          system_id: "abc123",
        },
      },
      meta: {
        model: "device",
        method: "update",
      },
    });
  });
});
