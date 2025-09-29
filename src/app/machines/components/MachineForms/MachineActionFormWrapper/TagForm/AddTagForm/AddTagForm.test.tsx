import configureStore from "redux-mock-store";

import type { Props } from "./AddTagForm";
import AddTagForm from "./AddTagForm";

import { machineActions } from "@/app/store/machine";
import type { FetchFilters } from "@/app/store/machine/types";
import { FetchGroupKey } from "@/app/store/machine/types";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import { FetchNodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter } from "@/testing/utils";

const mockBaseAddTagForm = vi.fn();
vi.mock("@/app/base/components/NodeTagForm", () => ({
  default: (props: Props) => mockBaseAddTagForm(props),
}));

const mockStore = configureStore<RootState>();

let state: RootState;

beforeEach(() => {
  vi.spyOn(query, "generateCallId").mockReturnValueOnce("mocked-nanoid");
  state = factory.rootState({
    machine: factory.machineState({
      counts: factory.machineStateCounts({
        "mocked-nanoid": factory.machineStateCount({
          count: 1,
          loaded: true,
        }),
        "mocked-nanoid-1": factory.machineStateCount({
          count: 1,
          loaded: true,
        }),
        "mocked-nanoid-2": factory.machineStateCount({
          count: 1,
          loaded: true,
        }),
      }),
    }),
    tag: factory.tagState({
      items: [
        factory.tag({
          id: 1,
          name: "rad",
        }),
      ],
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("set the analytics category for the machine list", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <AddTagForm machines={[]} name="new-tag" onTagCreated={vi.fn()} />,
    { route: "/tags", store }
  );
  expect(mockBaseAddTagForm).toHaveBeenCalledWith(
    expect.objectContaining({
      onSaveAnalytics: {
        action: "Manual tag created",
        category: "Machine list create tag form",
        label: "Save",
      },
    })
  );
});

it("set the analytics category for the machine details", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <AddTagForm
      machines={[]}
      name="new-tag"
      onTagCreated={vi.fn()}
      viewingDetails
    />,
    { route: "/tags", store }
  );
  expect(mockBaseAddTagForm).toHaveBeenCalledWith(
    expect.objectContaining({
      onSaveAnalytics: {
        action: "Manual tag created",
        category: "Machine details create tag form",
        label: "Save",
      },
    })
  );
});

it("set the analytics category for the machine config", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <AddTagForm
      machines={[]}
      name="new-tag"
      onTagCreated={vi.fn()}
      viewingMachineConfig
    />,
    { route: "/tags", store }
  );
  expect(mockBaseAddTagForm).toHaveBeenCalledWith(
    expect.objectContaining({
      onSaveAnalytics: {
        action: "Manual tag created",
        category: "Machine configuration create tag form",
        label: "Save",
      },
    })
  );
});

it("generates a deployed message for a single machine", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <AddTagForm machines={[]} name="new-tag" onTagCreated={vi.fn()} />,
    { route: "/tags", store }
  );
  expect(
    mockBaseAddTagForm.mock.calls[0][0]
      .generateDeployedMessage(1)
      .startsWith("1 selected machine is deployed")
  ).toBe(true);
});

it("generates a deployed message for multiple machines", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(
    <AddTagForm machines={[]} name="new-tag" onTagCreated={vi.fn()} />,
    { route: "/tags", store }
  );
  expect(
    mockBaseAddTagForm.mock.calls[0][0]
      .generateDeployedMessage(2)
      .startsWith("2 selected machines are deployed")
  ).toBe(true);
});

it("fetches deployed machine count for selected machines", async () => {
  const store = mockStore(state);
  const selectedMachines = { items: ["abc", "def"] };
  renderWithBrowserRouter(
    <AddTagForm
      name="new-tag"
      onTagCreated={vi.fn()}
      selectedMachines={selectedMachines}
    />,
    { route: "/tags", store }
  );
  const expected = machineActions.count("mocked-nanoid", {
    status: FetchNodeStatus.DEPLOYED,
    id: selectedMachines.items,
  } as FetchFilters);
  const actual = store
    .getActions()
    .find((action) => action.type === expected.type);
  expect(actual).toStrictEqual(expected);
});

it("fetches deployed machine count separately for deployed group when selected", async () => {
  vi.spyOn(query, "generateCallId").mockRestore();
  vi.spyOn(query, "generateCallId")
    .mockReturnValueOnce("mocked-nanoid-1")
    .mockReturnValueOnce("mocked-nanoid-2");
  const store = mockStore(state);
  const selectedMachines = {
    items: ["abc", "def"],
    groups: [FetchNodeStatus.DEPLOYED],
    grouping: FetchGroupKey.Status,
  };
  renderWithBrowserRouter(
    <AddTagForm
      name="new-tag"
      onTagCreated={vi.fn()}
      selectedMachines={selectedMachines}
    />,
    { route: "/tags", store }
  );
  const expected = [
    machineActions.count("mocked-nanoid-1", {
      status: FetchNodeStatus.DEPLOYED,
      id: selectedMachines.items,
    }),
    machineActions.count("mocked-nanoid-2", {
      status: FetchNodeStatus.DEPLOYED,
    }),
  ];
  const actual = store
    .getActions()
    .filter((action) => action.type === expected[0].type);
  expect(actual).toHaveLength(2);
  expected.forEach((action, index) => {
    expect(action).toStrictEqual(actual[index]);
  });
});

it("fetches deployed machine count when all machines are selected", async () => {
  const store = mockStore(state);
  const selectedMachines = {
    filter: {},
  };
  renderWithBrowserRouter(
    <AddTagForm
      name="new-tag"
      onTagCreated={vi.fn()}
      selectedMachines={selectedMachines}
    />,
    { route: "/tags", store }
  );
  const expected = machineActions.count("mocked-nanoid", {
    status: FetchNodeStatus.DEPLOYED,
  });
  const countActions = store
    .getActions()
    .filter((action) => action.type === expected.type);
  expect(countActions).toHaveLength(1);
  expect(countActions[0]).toStrictEqual(expected);
});

it(`fetches deployed machine count only for selected items
    when grouping by status and group other than deployed is selected`, async () => {
  const store = mockStore(state);
  const selectedMachines = {
    items: ["abc", "def"],
    groups: [FetchNodeStatus.COMMISSIONING],
    grouping: FetchGroupKey.Status,
  };
  renderWithBrowserRouter(
    <AddTagForm
      name="new-tag"
      onTagCreated={vi.fn()}
      selectedMachines={selectedMachines}
    />,
    { route: "/tags", store }
  );
  const expected = machineActions.count("mocked-nanoid", {
    status: FetchNodeStatus.DEPLOYED,
    id: selectedMachines.items,
  });
  const countActions = store
    .getActions()
    .filter((action) => action.type === expected.type);
  expect(countActions).toHaveLength(1);
  expect(countActions[0]).toStrictEqual(expected);
});
