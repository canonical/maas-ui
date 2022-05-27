import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MachineName from "./MachineName";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("MachineName", () => {
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
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            domain,
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("can update a machine with the new name and domain", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <CompatRouter>
            <MachineName
              editingName={true}
              id="abc123"
              setEditingName={jest.fn()}
            />
          </CompatRouter>
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
      store.getActions().find((action) => action.type === "machine/update")
    ).toStrictEqual({
      type: "machine/update",
      payload: {
        params: {
          domain: domain,
          extra_macs: [],
          hostname: "new-lease",
          pxe_mac: "de:ad:be:ef:aa:b1",
          system_id: "abc123",
        },
      },
      meta: {
        model: "machine",
        method: "update",
      },
    });
  });
});
