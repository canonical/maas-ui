import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import HardwareCard from "./HardwareCard";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("renders with system data", () => {
  const machine = machineDetailsFactory({ system_id: "abc123" });
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [machine] }),
  });
  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <HardwareCard node={machine} />
      </MemoryRouter>
    </Provider>
  );
  expect(wrapper.find("Card")).toMatchSnapshot();
});

it("renders when system data is not available", () => {
  const machine = machineDetailsFactory({ metadata: {}, system_id: "abc123" });
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [machine] }),
  });
  const store = mockStore(state);
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
      >
        <HardwareCard node={machine} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    wrapper
      .find("ul .p-list__item-value")
      .everyWhere((item) => !item.text() || item.text() === "Unknown")
  ).toBe(true);
});
