import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EditPhysicalFields from "./EditPhysicalFields";

import type { NetworkInterface } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  machineDetails as machineDetailsFactory,
  machineInterface as machineInterfaceFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  vlan as vlanFactory,
  vlanState as vlanStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("EditPhysicalFields", () => {
  let nic: NetworkInterface;
  let state: RootState;

  beforeEach(() => {
    nic = machineInterfaceFactory({
      id: 1,
    });
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [fabricFactory({}), fabricFactory()],
        loaded: true,
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            interfaces: [nic],
            system_id: "abc123",
          }),
        ],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
        }),
      }),
      subnet: subnetStateFactory({
        items: [subnetFactory(), subnetFactory()],
        loaded: true,
      }),
      vlan: vlanStateFactory({
        items: [vlanFactory(), vlanFactory()],
        loaded: true,
      }),
    });
  });

  it("does not allow the link speed to be higher than the interface speed", async () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik
            initialValues={{ interface_speed: 0, link_speed: 0 }}
            onSubmit={jest.fn()}
          >
            <EditPhysicalFields nic={nic} />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    wrapper.find("input[name='interface_speed']").simulate("change", {
      target: {
        name: "interface_speed",
        value: 1,
      },
    });
    await waitForComponentToPaint(wrapper);
    wrapper.find("input[name='link_speed']").simulate("change", {
      target: {
        name: "link_speed",
        value: 2,
      },
    });
    wrapper.find("input[name='link_speed']").simulate("blur");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find(".p-form-validation__message").exists()).toBe(true);
    expect(wrapper.find(".p-form-validation__message").text()).toBe(
      "Caution: Link speed should not be higher than interface speed"
    );
  });
});
