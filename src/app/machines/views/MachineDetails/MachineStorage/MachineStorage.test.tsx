import { Route, Routes } from "react-router-dom";

import { storageLayoutOptions } from "./ChangeStorageLayoutMenu/ChangeStorageLayoutMenu";
import MachineStorage from "./MachineStorage";

import * as hooks from "@/app/base/hooks/analytics";
import { NodeStatusCode } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

it("displays a spinner if machine is loading", () => {
  const state = factory.rootState({
    machine: factory.machineState({
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
  const state = factory.rootState({
    general: factory.generalState({
      powerTypes: factory.powerTypesState({
        data: [factory.powerType()],
      }),
    }),
    machine: factory.machineState({
      items: [
        factory.machineDetails({
          locked: false,
          permissions: ["edit"],
          status_code: NodeStatusCode.READY,
          system_id: "abc123",
        }),
      ],
      statuses: factory.machineStatuses({
        abc123: factory.machineStatus(),
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
  const state = factory.rootState({
    machine: factory.machineState({
      items: [factory.machineDetails({ system_id: "abc123" })],
      loaded: true,
    }),
  });
  const mockSendAnalytics = vi.fn();
  const mockUseSendAnalytics = vi
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
