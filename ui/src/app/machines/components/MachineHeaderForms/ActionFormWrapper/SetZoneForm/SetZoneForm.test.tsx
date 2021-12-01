import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SetZoneForm from "./SetZoneForm";

import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("SetZoneForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          machineFactory({
            system_id: "abc123",
          }),
          machineFactory({
            system_id: "def456",
          }),
        ],
        selected: [],
        statuses: {
          abc123: machineStatusFactory({}),
          def456: machineStatusFactory({}),
        },
      }),
      zone: zoneStateFactory({
        items: [
          zoneFactory({ id: 0, name: "default" }),
          zoneFactory({ id: 1, name: "zone-1" }),
        ],
        loaded: true,
      }),
    });
  });

  it("correctly dispatches actions to set zones of given machines", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <SetZoneForm
            clearHeaderContent={jest.fn()}
            machines={state.machine.items}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      submitFormikForm(wrapper, {
        zone: "zone-1",
      })
    );
    expect(
      store.getActions().filter((action) => action.type === "machine/setZone")
    ).toStrictEqual([
      {
        type: "machine/setZone",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.SET_ZONE,
            extra: {
              zone_id: 1,
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/setZone",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.SET_ZONE,
            extra: {
              zone_id: 1,
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });
});
