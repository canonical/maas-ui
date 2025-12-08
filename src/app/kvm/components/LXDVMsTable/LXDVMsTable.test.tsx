import LXDVMsTable from "./LXDVMsTable";

import { machineActions } from "@/app/store/machine";
import { FetchSortDirection, FetchGroupKey } from "@/app/store/machine/types";
import { generateCallId } from "@/app/store/machine/utils/query";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen } from "@/testing/utils";

describe("LXDVMsTable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches machines on load", () => {
    const state = factory.rootState();

    const { store } = renderWithProviders(
      <LXDVMsTable
        getResources={vi.fn()}
        pods={["pod1"]}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { initialEntries: ["/kvm/1/project"], state }
    );

    const options = {
      filter: { pod: ["pod1"] },
      group_collapsed: undefined,
      group_key: null,
      page_number: 1,
      page_size: 10,
      sort_direction: FetchSortDirection.Ascending,
      sort_key: FetchGroupKey.Hostname,
    };
    const expectedAction = machineActions.fetch(generateCallId(options), {
      filter: { pod: ["pod1"] },
      group_collapsed: undefined,
      group_key: null,
      page_number: 1,
      page_size: 10,
      sort_direction: FetchSortDirection.Ascending,
      sort_key: FetchGroupKey.Hostname,
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("clears machine selected state on unmount", async () => {
    const state = factory.rootState();

    const {
      result: { unmount },
      store,
    } = renderWithProviders(
      <LXDVMsTable
        getResources={vi.fn()}
        pods={["pod1"]}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { initialEntries: ["/kvm/1/project"], state }
    );

    unmount();

    const expectedAction = machineActions.setSelected(null);
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("shows an add VM button if function provided", () => {
    const state = factory.rootState();

    renderWithProviders(
      <LXDVMsTable
        getResources={vi.fn()}
        onAddVMClick={vi.fn()}
        pods={["pod1"]}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { initialEntries: ["/kvm/1/project"], state }
    );

    expect(screen.getByRole("button", { name: "Add VM" })).toBeInTheDocument();
  });

  it("does not show an add VM button if no function provided", () => {
    const state = factory.rootState();

    renderWithProviders(
      <LXDVMsTable
        getResources={vi.fn()}
        pods={["pod1"]}
        searchFilter=""
        setSearchFilter={vi.fn()}
      />,
      { initialEntries: ["/kvm/1/project"], state }
    );

    expect(
      screen.queryByRole("button", { name: "Add VM" })
    ).not.toBeInTheDocument();
  });
});
