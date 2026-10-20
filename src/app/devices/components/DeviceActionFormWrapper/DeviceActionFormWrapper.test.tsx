import DeviceActionFormWrapper from "./DeviceActionFormWrapper";

import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { userEvent, screen, renderWithProviders } from "@/testing/utils";

describe("DeviceActionFormWrapper", () => {
  it("can set selected devices to those that can perform action", async () => {
    const state = factory.rootState();
    const devices = [
      factory.device({ system_id: "abc123", permissions: ["edit"] }),
      factory.device({
        system_id: "def456",
        actions: [NodeActions.DELETE],
        permissions: [],
      }),
    ];

    const setRowSelection = vi.fn();
    renderWithProviders(
      <DeviceActionFormWrapper
        action={NodeActions.DELETE}
        devices={devices}
        setRowSelection={setRowSelection}
        viewingDetails={false}
      />,
      { state }
    );

    await userEvent.click(screen.getByTestId("on-update-selected"));

    expect(setRowSelection).toHaveBeenCalledWith({
      [devices[0].id]: true,
    });
  });

  it("warns when some selected devices lack the edit permission", () => {
    const devices = [
      factory.device({ system_id: "abc123", permissions: ["edit"] }),
      factory.device({ system_id: "def456", permissions: [] }),
    ];

    renderWithProviders(
      <DeviceActionFormWrapper
        action={NodeActions.SET_ZONE}
        devices={devices}
        viewingDetails={false}
      />,
      { state: factory.rootState() }
    );

    expect(screen.getByText(/Cannot set zone of 1 device/)).toBeInTheDocument();
  });

  it("does not warn when all selected devices have the edit permission", () => {
    const devices = [
      factory.device({ system_id: "abc123", permissions: ["edit"] }),
      factory.device({ system_id: "def456", permissions: ["edit"] }),
    ];

    renderWithProviders(
      <DeviceActionFormWrapper
        action={NodeActions.DELETE}
        devices={devices}
        viewingDetails={false}
      />,
      { state: factory.rootState() }
    );

    expect(screen.queryByText(/cannot be deleted/)).not.toBeInTheDocument();
  });
});
