import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddTagForm from "./AddTagForm";
import type { Props } from "./AddTagForm";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockBaseAddTagForm = jest.fn();
jest.mock("app/tags/components/AddTagForm", () => (props: Props) => {
  mockBaseAddTagForm(props);
  return null;
});

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory();
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("set the analytics category for the machine list", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm machines={[]} name="new-tag" onTagCreated={jest.fn()} />
      </MemoryRouter>
    </Provider>
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
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm
          machines={[]}
          name="new-tag"
          onTagCreated={jest.fn()}
          viewingDetails
        />
      </MemoryRouter>
    </Provider>
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
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm
          machines={[]}
          name="new-tag"
          onTagCreated={jest.fn()}
          viewingMachineConfig
        />
      </MemoryRouter>
    </Provider>
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
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm machines={[]} name="new-tag" onTagCreated={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    mockBaseAddTagForm.mock.calls[0][0]
      .generateDeployedMessage(1)
      .startsWith("1 selected machine is deployed")
  ).toBe(true);
});

it("generates a deployed message for multiple machines", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <AddTagForm machines={[]} name="new-tag" onTagCreated={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    mockBaseAddTagForm.mock.calls[0][0]
      .generateDeployedMessage(2)
      .startsWith("2 selected machines are deployed")
  ).toBe(true);
});
