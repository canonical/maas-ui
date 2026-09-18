import LXDHostVMs from "./LXDHostVMs";

import ComposeForm from "@/app/kvm/components/ComposeForm";
import { machineActions } from "@/app/store/machine";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  mockSidePanel,
  renderWithProviders,
  screen,
  setupMockServer,
  userEvent,
  waitFor,
} from "@/testing/utils";

const { mockOpen } = await mockSidePanel();
const mockServer = setupMockServer(
  authResolvers.getCurrentUser.handler(),
  authResolvers.getMeEntitlements.handler()
);

describe("LXDHostVMs", () => {
  it("shows a spinner if pod has not loaded yet", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [],
        loaded: false,
      }),
    });

    renderWithProviders(
      <LXDHostVMs hostId={1} searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can view resources by NUMA node", async () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [
          factory.pod({
            id: 1,
            resources: factory.podResources({ numa: [factory.podNuma()] }),
          }),
        ],
      }),
    });

    renderWithProviders(
      <LXDHostVMs hostId={1} searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );

    expect(screen.queryByTestId("numa-resources")).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("numa-switch"));

    expect(screen.getByTestId("numa-resources")).toBeInTheDocument();
  });

  it("displays the host name when in a cluster", async () => {
    const pod = factory.pod({ id: 1, name: "cluster host" });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });
    renderWithProviders(
      <LXDHostVMs
        clusterId={2}
        hostId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { state }
    );
    expect(screen.getByTestId("toolbar-title")).toHaveTextContent(
      `VMs on ${pod.name}`
    );
  });

  it("does not display the host name when in a single host", async () => {
    const pod = factory.pod({ id: 1, name: "cluster host" });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });
    renderWithProviders(
      <LXDHostVMs hostId={1} searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    expect(screen.getByTestId("toolbar-title")).toHaveTextContent(
      `VMs on this host`
    );
  });

  it("can open the compose VM form", async () => {
    const pod = factory.pod({ id: 1 });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });

    renderWithProviders(
      <LXDHostVMs hostId={1} searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add VM" })
      ).not.toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add VM" }));

    expect(mockOpen).toHaveBeenCalledWith({
      component: ComposeForm,
      title: "Compose",
      props: {
        hostId: 1,
      },
    });
  });

  it("disables the Add VM button without the edit machines entitlement", async () => {
    mockServer.use(authResolvers.getMeEntitlements.handler([]));
    const pod = factory.pod({ id: 1 });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });

    renderWithProviders(
      <LXDHostVMs hostId={1} searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add VM" })).toBeAriaDisabled();
    });
    await userEvent.click(screen.getByRole("button", { name: "Add VM" }));

    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("fetches VMs for the host", async () => {
    const pod = factory.pod({ id: 1, name: "cluster host" });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });

    const { store } = renderWithProviders(
      <LXDHostVMs hostId={1} searchFilter="" setSearchFilter={vi.fn()} />,
      { state }
    );
    const expected = machineActions.fetch("123456", {
      filter: { pod: [pod.name] },
    });

    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches[fetches.length - 1].payload.params.filter).toStrictEqual({
      pod: [pod.name],
    });
  });
});
