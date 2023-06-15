import reduxToolkit from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import TagForm, { Label } from "./TagForm";
import { Label as TagFormChangesLabel } from "./TagFormChanges";
import { Label as TagFormFieldsLabel } from "./TagFormFields";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineActionState,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { tagStateListFactory } from "testing/factories/state";
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";
import { userEvent, render, screen, waitFor } from "testing/utils";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  const tags = [
    tagFactory({ id: 1, name: "tag1" }),
    tagFactory({ id: 2, name: "tag2" }),
  ];
  state = rootStateFactory({
    tag: tagStateFactory({
      items: tags,
      loaded: true,
      lists: {
        "mocked-nanoid": tagStateListFactory({
          items: [
            tagFactory({ id: 1, name: "tag1" }),
            tagFactory({ id: 2, name: "tag2" }),
          ],
          loaded: true,
        }),
      },
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("dispatches action to fetch tags on load", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearSidePanelContent={jest.fn()}
            machines={[]}
            processingCount={0}
            selectedMachines={{ items: ["abc123"] }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(store.getActions().some((action) => action.type === "tag/fetch")).toBe(
    true
  );
});

it("correctly dispatches actions to tag machines", async () => {
  const machines = [
    machineFactory({ system_id: "abc123", tags: [] }),
    machineFactory({ system_id: "def456", tags: [] }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearSidePanelContent={jest.fn()}
            machines={machines}
            processingCount={0}
            selectedMachines={{
              items: machines.map((machine) => machine.system_id),
            }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getByRole("textbox", { name: TagFormFieldsLabel.TagInput })
  );
  await userEvent.click(screen.getByRole("option", { name: "tag1" }));
  await userEvent.click(screen.getByRole("option", { name: "tag2" }));
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.tag(
        { filter: { id: ["abc123", "def456"] }, tags: [1, 2] },
        "mocked-nanoid"
      ),
    ];
    const actualActions = store
      .getActions()
      .filter((action) => action.type === expectedActions[0].type);
    expect(actualActions).toStrictEqual(expectedActions);
  });
});

it("correctly dispatches actions to untag machines", async () => {
  const machines = [
    machineFactory({ system_id: "abc123", tags: [1, 2] }),
    machineFactory({ system_id: "def456", tags: [1, 2] }),
  ];
  state.tag.lists = {
    "mocked-nanoid": tagStateListFactory({
      items: [
        tagFactory({ id: 1, name: "tag1", machine_count: 1 }),
        tagFactory({ id: 2, name: "tag2", machine_count: 1 }),
      ],
      loaded: true,
    }),
  };
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearSidePanelContent={jest.fn()}
            machines={machines}
            processingCount={0}
            selectedMachines={{
              items: machines.map((machine) => machine.system_id),
            }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  const deleteButtons = screen.getAllByRole("button", {
    name: TagFormChangesLabel.Remove,
  });
  await userEvent.click(deleteButtons[0]);
  await userEvent.click(deleteButtons[1]);
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.untag(
        {
          filter: { id: ["abc123", "def456"] },
          tags: [1, 2],
        },
        "mocked-nanoid"
      ),
    ];
    const actualActions = store
      .getActions()
      .filter((action) => action.type === expectedActions[0].type);
    expect(actualActions).toStrictEqual(expectedActions);
  });
});

it("correctly dispatches actions to tag and untag a machine", async () => {
  const machines = [machineFactory({ system_id: "abc123", tags: [1] })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearSidePanelContent={jest.fn()}
            machines={machines}
            processingCount={0}
            selectedMachines={{ items: machines.map((item) => item.system_id) }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(
    screen.getByRole("textbox", { name: TagFormFieldsLabel.TagInput })
  );
  await userEvent.click(screen.getByRole("option", { name: "tag2" }));
  await userEvent.click(
    screen.getByRole("button", { name: TagFormChangesLabel.Remove })
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.tag(
        { filter: { id: ["abc123"] }, tags: [2] },
        "mocked-nanoid"
      ),
      machineActions.untag(
        { filter: { id: ["abc123"] }, tags: [1] },
        "mocked-nanoid"
      ),
    ];
    const actualActions = store
      .getActions()
      .filter(
        (action) =>
          action.type === expectedActions[0].type ||
          action.type === expectedActions[1].type
      );
    expect(actualActions).toStrictEqual(expectedActions);
  });
});

it("shows saving label if not viewing from machine config page", () => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  const machines = [
    machineFactory({ system_id: "abc123", tags: [] }),
    machineFactory({ system_id: "def456", tags: [] }),
  ];
  state.machine.actions["mocked-nanoid"] = machineActionState({
    status: "loading",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearSidePanelContent={jest.fn()}
            machines={machines}
            processingCount={1}
            viewingDetails={false}
            viewingMachineConfig={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("saving-label")).toBeInTheDocument();
  jest.restoreAllMocks();
});

it("does not show saving label if viewing from machine config page", () => {
  const machines = [
    machineFactory({ system_id: "abc123", tags: [] }),
    machineFactory({ system_id: "def456", tags: [] }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearSidePanelContent={jest.fn()}
            machines={machines}
            processingCount={1}
            viewingDetails
            viewingMachineConfig
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.queryByTestId("saving-label")).not.toBeInTheDocument();
});

it("shows a notification on success", async () => {
  const machines = [machineFactory({ system_id: "abc123", tags: [1] })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearSidePanelContent={jest.fn()}
            machines={machines}
            processingCount={0}
            selectedCount={machines.length}
            selectedMachines={{ items: machines.map((item) => item.system_id) }}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  // Mock state.tag.saved transitioning from "false" to "true"
  mockFormikFormSaved();
  await userEvent.click(
    screen.getByRole("textbox", { name: TagFormFieldsLabel.TagInput })
  );
  await userEvent.click(screen.getByRole("option", { name: "tag2" }));
  await userEvent.click(
    screen.getByRole("button", { name: TagFormChangesLabel.Remove })
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const action = store
      .getActions()
      .find((action) => action.type === "message/add");
    expect(action.payload.message).toBe(Label.Saved);
  });
});
