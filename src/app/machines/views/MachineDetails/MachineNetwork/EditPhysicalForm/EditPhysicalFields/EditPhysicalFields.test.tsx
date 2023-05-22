import { waitFor, render } from "@testing-library/react";
import { Formik } from "formik";
import configureStore from "redux-mock-store";

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
import { renderWithBrowserRouter, screen } from "testing/utils";

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

  it("shows a warning if link speed is higher than interface speed", async () => {
    const store = mockStore(state);
    const { getByRole, getByText } = renderWithBrowserRouter(
      <EditPhysicalFields nic={nic} />,
      { route: "/machines", store }
    );

    const interfaceSpeedInput = getByRole("textbox", {
      name: "Interface Speed",
    });
    const linkSpeedInput = getByRole("textbox", { name: "Link Speed" });

    userEvent.type(interfaceSpeedInput, "1");
    await waitFor(() => expect(interfaceSpeedInput).toHaveValue("1"));

    userEvent.type(linkSpeedInput, "2");
    await waitFor(() => expect(linkSpeedInput).toHaveValue("2"));
    userEvent.tab();
    await waitFor(() =>
      screen.getByText(
        /Caution: Link speed should not be higher than interface speed/i
      )
    );

    expect(
      screen.getByText(
        /Caution: Link speed should not be higher than interface speed/i
      )
    ).toBeInTheDocument();
  });
});
