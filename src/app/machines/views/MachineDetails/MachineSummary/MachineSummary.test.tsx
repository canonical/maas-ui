import { MachineSummary } from "./MachineSummary";

import { NodeStatusCode } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

describe("MachineSummary", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        items: [machineDetailsFactory({ system_id: "abc123" })],
      }),
    });
  });

  it("displays a spinner if machines are loading", () => {
    state.machine.loading = true;
    const { rerender } = render(
      <MachineSummary setSidePanelContent={jest.fn()} />,
      { route: "/machine/abc123", store: mockStore(state) }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders", () => {
    const { container } = render(
      <MachineSummary setSidePanelContent={jest.fn()} />,
      { route: "/machine/abc123", store: mockStore(state) }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("shows workload annotations for deployed machines", () => {
    state.machine.items = [
      machineDetailsFactory({
        status_code: NodeStatusCode.DEPLOYED,
        system_id: "abc123",
      }),
    ];
    render(<MachineSummary setSidePanelContent={jest.fn()} />, {
      route: "/machine/abc123/summary",
      store: mockStore(state),
    });
    expect(screen.getByText(/Workload Annotations/i)).toBeInTheDocument();
  });

  it("shows workload annotations for allocated machines", () => {
    state.machine.items = [
      machineDetailsFactory({
        status_code: NodeStatusCode.ALLOCATED,
        system_id: "abc123",
      }),
    ];
    render(<MachineSummary setSidePanelContent={jest.fn()} />, {
      route: "/machine/abc123/summary",
      store: mockStore(state),
    });
    expect(screen.getByText(/Workload Annotations/i)).toBeInTheDocument();
  });

  it("does not show workload annotations for machines that are neither deployed nor allocated", () => {
    state.machine.items = [
      machineDetailsFactory({
        status_code: NodeStatusCode.NEW,
        system_id: "abc123",
      }),
    ];
    render(<MachineSummary setSidePanelContent={jest.fn()} />, {
      route: "/machine/abc123/summary",
      store: mockStore(state),
    });
    expect(screen.queryByText(/Workload Annotations/i)).not.toBeInTheDocument();
  });
});
