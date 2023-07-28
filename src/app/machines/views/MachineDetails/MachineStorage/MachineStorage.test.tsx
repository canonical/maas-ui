import { Route, Routes } from "react-router-dom-v5-compat";

import { storageLayoutOptions } from "./ChangeStorageLayout/ChangeStorageLayout";
import MachineStorage from "./MachineStorage";

import * as hooks from "app/base/hooks/analytics";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

it("displays a spinner if machine is loading", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [],
    }),
  });
  renderWithBrowserRouter(<MachineStorage />, {
    state,
    route: "/machine/abc123",
  });
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
});

it("renders storage layout dropdown if machine's storage can be edited", async () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      powerTypes: powerTypesStateFactory({
        data: [powerTypeFactory()],
      }),
    }),
    machine: machineStateFactory({
      items: [
        machineDetailsFactory({
          locked: false,
          permissions: ["edit"],
          system_id: "abc123",
        }),
      ],
      statuses: machineStatusesFactory({
        abc123: machineStatusFactory(),
      }),
    }),
  });
  renderWithBrowserRouter(
    <Routes>
      <Route element={<MachineStorage />} path="/machine/:id/storage" />
    </Routes>,
    {
      state,
      route: "/machine/abc123/storage",
    }
  );
  expect(
    screen.getByRole("button", { name: "Change storage layout" })
  ).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "Change storage layout" })
  );
  expect(screen.getByLabelText("submenu")).toBeInTheDocument();
  storageLayoutOptions.forEach((group) => {
    group.forEach((option) => {
      expect(
        screen.getByRole("button", { name: option.label })
      ).toBeInTheDocument();
    });
  });
});

it("sends an analytics event when clicking on the MAAS docs footer link", async () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machineDetailsFactory({ system_id: "abc123" })],
      loaded: true,
    }),
  });
  const mockSendAnalytics = jest.fn();
  const mockUseSendAnalytics = jest
    .spyOn(hooks, "useSendAnalytics")
    .mockImplementation(() => mockSendAnalytics);
  renderWithBrowserRouter(
    <Routes>
      <Route element={<MachineStorage />} path="/machine/:id/storage" />
    </Routes>,
    {
      state,
      route: "/machine/abc123/storage",
    }
  );
  await userEvent.click(screen.getByTestId("docs-footer-link"));
  expect(mockSendAnalytics).toHaveBeenCalled();
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "Machine storage",
    "Click link to MAAS docs",
    "Windows",
  ]);
  mockUseSendAnalytics.mockRestore();
});
