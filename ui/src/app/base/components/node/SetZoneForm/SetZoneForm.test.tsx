import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SetZoneForm from "./SetZoneForm";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
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
      zone: zoneStateFactory({
        items: [
          zoneFactory({ id: 0, name: "default" }),
          zoneFactory({ id: 1, name: "zone-1" }),
        ],
      }),
    });
  });

  it("correctly runs function to set zones of given nodes", () => {
    const onSubmit = jest.fn();
    const nodes = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
    ];

    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <SetZoneForm
          clearHeaderContent={jest.fn()}
          modelName="machine"
          nodes={nodes}
          onSubmit={onSubmit}
          processingCount={0}
          viewingDetails={false}
        />
      </Provider>
    );

    submitFormikForm(wrapper, {
      zone: 1,
    });

    expect(onSubmit).toHaveBeenCalledWith(1);
  });
});
