import configureStore from "redux-mock-store";

import MachineSelectBox from "./MachineSelectBox";

import { DEFAULT_DEBOUNCE_INTERVAL } from "@/app/base/components/DebounceSearchBox/DebounceSearchBox";
import { actions as machineActions } from "@/app/store/machine";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import { rootState as rootStateFactory } from "@/testing/factories";
import { userEvent, screen, renderWithMockStore } from "@/testing/utils";

const mockStore = configureStore<RootState>();

beforeEach(() => {
  vi.spyOn(query, "generateCallId")
    .mockReturnValueOnce("mocked-nanoid-1")
    .mockReturnValueOnce("mocked-nanoid-2");
  vi.useFakeTimers();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it("displays a listbox and a search input field", async () => {
  renderWithMockStore(<MachineSelectBox onSelect={vi.fn()} />);

  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

it("fetches machines on mount", async () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  renderWithMockStore(<MachineSelectBox onSelect={vi.fn()} />, {
    store,
  });

  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  const expectedAction = machineActions.fetch("mocked-nanoid-1", {
    filter: { free_text: "" },
    group_collapsed: undefined,
    group_key: null,
    page_number: 1,
    page_size: 5,
    sort_direction: null,
    sort_key: null,
  });
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("requests machines filtered by the free text input value", async () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  renderWithMockStore(<MachineSelectBox onSelect={vi.fn()} />, {
    store,
  });

  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  await user.type(screen.getByRole("combobox"), "test-machine");
  const expectedActionParams = {
    group_collapsed: undefined,
    group_key: null,
    page_number: 1,
    page_size: 5,
    sort_direction: null,
    sort_key: null,
  };
  const expectedInitialAction = machineActions.fetch("mocked-nanoid-1", {
    filter: { free_text: "" },
    ...expectedActionParams,
  });
  const expectedAction = machineActions.fetch("mocked-nanoid-2", {
    filter: { free_text: "test-machine" },
    ...expectedActionParams,
  });

  vi.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);

  await vi.waitFor(() =>
    expect(
      store.getActions().filter((action) => action.type === expectedAction.type)
        .length
    ).toEqual(2)
  );
  const machineFetchActions = store
    .getActions()
    .filter((action) => action.type === expectedAction.type);
  expect(machineFetchActions[0]).toStrictEqual(expectedInitialAction);
  expect(machineFetchActions[1]).toStrictEqual(expectedAction);
});
