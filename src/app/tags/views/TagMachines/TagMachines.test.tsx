import TagMachines, { Label } from "./TagMachines";

import urls from "@/app/base/urls";
import { columnLabels, MachineColumns } from "@/app/machines/constants";
import { machineActions } from "@/app/store/machine";
import { FetchGroupKey, FetchSortDirection } from "@/app/store/machine/types";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import { NodeStatus, FetchNodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

const callId = "mocked-nanoid";
let state: RootState;
const routeOptions = {
  route: urls.tags.tag.index({ id: 1 }),
  routePattern: urls.tags.tag.index(null),
};

beforeEach(() => {
  vi.spyOn(query, "generateCallId").mockReturnValue(callId);
  const machines = [
    factory.machine({
      domain: factory.modelRef({ id: 1, name: "test" }),
      hostname: "deployed",
      status: NodeStatus.DEPLOYED,
      tags: [1],
    }),
  ];
  state = factory.rootState({
    machine: factory.machineState({
      items: machines,
      lists: {
        [callId]: factory.machineStateList({
          loaded: true,
          groups: [
            factory.machineStateListGroup({
              items: machines.map(({ system_id }) => system_id),
              name: "Deployed",
            }),
          ],
        }),
      },
    }),
    tag: factory.tagState({
      items: [
        factory.tag({
          id: 1,
          machine_count: 1,
          name: "rad",
        }),
      ],
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("dispatches actions to fetch necessary data", () => {
  const { store } = renderWithBrowserRouter(<TagMachines />, {
    state,
    ...routeOptions,
  });

  const expectedActions = [
    machineActions.fetch(callId, {
      filter: {
        status: FetchNodeStatus.DEPLOYED,
        tags: ["rad"],
      },
      group_collapsed: undefined,
      group_key: null,
      page_number: 1,
      page_size: 50,
      sort_direction: FetchSortDirection.Ascending,
      sort_key: FetchGroupKey.Hostname,
    }),
    tagActions.fetch(),
  ];
  const actualActions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});

it("displays a message if the tag does not exist", () => {
  const state = factory.rootState({
    tag: factory.tagState({
      items: [],
      loading: false,
    }),
  });
  renderWithBrowserRouter(<TagMachines />, {
    state,
    ...routeOptions,
  });
  expect(screen.getByText("Tag not found")).toBeInTheDocument();
});

it("shows a spinner if the tag has not loaded yet", () => {
  const state = factory.rootState({
    tag: factory.tagState({
      items: [],
      loading: true,
    }),
  });
  renderWithBrowserRouter(<TagMachines />, {
    state,
    ...routeOptions,
  });
  expect(screen.getByTestId("Spinner")).toBeInTheDocument();
});

it("displays the machine list", async () => {
  renderWithBrowserRouter(<TagMachines />, {
    state,
    ...routeOptions,
  });
  expect(
    await screen.findByRole("grid", { name: Label.Machines })
  ).toBeInTheDocument();
  const rows = await screen.findAllByRole("gridcell", {
    name: columnLabels[MachineColumns.FQDN],
  });
  expect(rows).toHaveLength(1);
  expect(rows[0].textContent?.includes("deployed.test")).toBe(true);
});
