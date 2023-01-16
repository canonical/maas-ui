import reduxToolkit from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import configureStore from "redux-mock-store";

import MachineSelectBox from "./MachineSelectBox";

import { DEFAULT_DEBOUNCE_INTERVAL } from "app/base/components/DebounceSearchBox/DebounceSearchBox";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { screen, waitFor, renderWithMockStore } from "testing/utils";

const mockStore = configureStore<RootState>();

beforeEach(() => {
  jest
    .spyOn(reduxToolkit, "nanoid")
    .mockReturnValueOnce("mocked-nanoid-1")
    .mockReturnValueOnce("mocked-nanoid-2");
  jest.useFakeTimers();
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

it("displays a listbox and a search input field", async () => {
  renderWithMockStore(<MachineSelectBox onSelect={jest.fn()} />);

  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

it("fetches machines on mount", async () => {
  const state = rootStateFactory();
  const store = mockStore(state);
  renderWithMockStore(<MachineSelectBox onSelect={jest.fn()} />, {
    store,
  });

  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  const expectedAction = machineActions.fetch("mocked-nanoid-1", {
    filter: { free_text: "" },
    group_collapsed: undefined,
    group_key: null,
    page_number: 1,
    page_size: 15,
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
  renderWithMockStore(<MachineSelectBox onSelect={jest.fn()} />, {
    store,
  });

  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await user.type(screen.getByRole("combobox"), "test-machine");
  const expectedInitialAction = machineActions.fetch("mocked-nanoid-1", {
    filter: { free_text: "" },
    group_collapsed: undefined,
    group_key: null,
    page_number: 1,
    page_size: 15,
    sort_direction: null,
    sort_key: null,
  });
  const expectedAction = machineActions.fetch("mocked-nanoid-2", {
    filter: { free_text: "test-machine" },
    group_collapsed: undefined,
    group_key: null,
    page_number: 1,
    page_size: 15,
    sort_direction: null,
    sort_key: null,
  });
  await waitFor(() => {
    jest.advanceTimersByTime(DEFAULT_DEBOUNCE_INTERVAL);
  });
  await waitFor(() =>
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
