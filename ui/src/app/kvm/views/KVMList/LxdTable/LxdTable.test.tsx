import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import LxdTable from "./LxdTable";

import { PodType } from "app/store/pod/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LxdTable", () => {
  it("can group lxd pods by power address", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            power_address: "172.0.0.1",
            type: PodType.LXD,
          }),
          podFactory({
            power_address: "172.0.0.1",
            type: PodType.LXD,
          }),
          podFactory({
            power_address: "192.168.1.1",
            type: PodType.LXD,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/kvm", key: "testKey" }]}>
          <LxdTable />
        </MemoryRouter>
      </Provider>
    );
    const getLxdAddress = (rowNumber: number) =>
      wrapper
        .find("tbody TableRow")
        .at(rowNumber)
        .find("[data-test='lxd-address']");

    expect(getLxdAddress(0).text()).toBe("172.0.0.1");
    // Second address cell should be empty because it's in the group above.
    expect(getLxdAddress(1).exists()).toBe(false);
    expect(getLxdAddress(2).text()).toBe("192.168.1.1");
  });
});
