import { Formik } from "formik";

import EditPhysicalFields from "./EditPhysicalFields";

import type { RootState } from "app/store/root/types";
import type { NetworkInterface } from "app/store/types/node";
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
import {
  getByTextContent,
  renderWithBrowserRouter,
  screen,
  userEvent,
} from "testing/utils";

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

  it("shows a warning if link speed is higher than interface speed", async () => {
    renderWithBrowserRouter(
      <Formik
        initialValues={{ interface_speed: 0, link_speed: 0 }}
        onSubmit={jest.fn()}
      >
        <EditPhysicalFields nic={nic} />
      </Formik>,
      {
        route: "/machines",
        state,
      }
    );

    const interfaceSpeedInput = screen.getByRole("textbox", {
      name: "Interface speed (Gbps)",
    });
    const linkSpeedInput = screen.getByRole("textbox", {
      name: "Link speed (Gbps)",
    });

    await userEvent.type(interfaceSpeedInput, "1");
    await userEvent.type(linkSpeedInput, "2");

    await userEvent.tab();

    expect(
      getByTextContent(
        /Caution: Link speed should not be higher than interface speed/i
      )
    ).toBeInTheDocument();
  });
});
