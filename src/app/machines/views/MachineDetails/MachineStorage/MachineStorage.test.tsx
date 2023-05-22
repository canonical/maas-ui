import { render, screen } from 'testing/utils';
import MachineStorage from "./MachineStorage";
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

const mockStore = configureStore();

it("displays a spinner if machine is loading", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [],
    }),
  });
  const store = mockStore(state);
  render(
    <MachineStorage />,
    { store, route: "/machine/abc123" }
  );
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
});

it("renders storage layout dropdown if machine's storage can be edited", () => {
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
  const store = mockStore(state);
  render(
    <MachineStorage />,
    { store, route: "/machine/abc123/storage" }
  );
  expect(screen.getByLabelText(/Select Storage layout/)).toBeInTheDocument();
});

it("sends an analytics event when clicking on the MAAS docs footer link", () => {
  const state = rootStateFactory({
    machine: machineStateFactory({
      items: [machineDetailsFactory({ system_id: "abc123" })],
      loaded: true,
    }),
  });
  const store = mockStore(state);
  const mockSendAnalytics = jest.fn();
  const mockUseSendAnalytics = jest
    .spyOn(hooks, "useSendAnalytics")
    .mockImplementation(() => mockSendAnalytics);
  render(
    <MachineStorage />,
    { store, route: "/machine/abc123/storage" }
  );
  userEvent.click(screen.getByTestId("docs-footer-link"));  
  expect(mockSendAnalytics).toHaveBeenCalled();
  expect(mockSendAnalytics.mock.calls[0]).toEqual([
    "Machine storage",
    "Click link to MAAS docs",
    "Windows",
  ]);
  mockUseSendAnalytics.mockRestore();
});
```