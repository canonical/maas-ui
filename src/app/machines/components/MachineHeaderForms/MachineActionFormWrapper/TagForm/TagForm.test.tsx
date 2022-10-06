import reduxToolkit from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
import { mockFormikFormSaved } from "testing/mockFormikFormSaved";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({ id: 1, name: "tag1" }),
        tagFactory({ id: 2, name: "tag2" }),
      ],
      loaded: true,
    }),
  });
});

it("dispatches action to fetch tags on load", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            processingCount={0}
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
            clearHeaderContent={jest.fn()}
            machines={machines}
            processingCount={0}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByLabelText(TagFormFieldsLabel.TagInput));
  await userEvent.click(screen.getByRole("option", { name: "tag1" }));
  await userEvent.click(screen.getByRole("option", { name: "tag2" }));
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.tag({ system_id: "abc123", tags: [1, 2] }),
      machineActions.tag({ system_id: "def456", tags: [1, 2] }),
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
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines", key: "testKey" }]}
      >
        <CompatRouter>
          <TagForm
            clearHeaderContent={jest.fn()}
            machines={machines}
            processingCount={0}
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
      machineActions.untag({ system_id: "abc123", tags: [1, 2] }),
      machineActions.untag({ system_id: "def456", tags: [1, 2] }),
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
            clearHeaderContent={jest.fn()}
            machines={machines}
            processingCount={0}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByLabelText(TagFormFieldsLabel.TagInput));
  await userEvent.click(screen.getByRole("option", { name: "tag2" }));
  await userEvent.click(
    screen.getByRole("button", { name: TagFormChangesLabel.Remove })
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.tag({ system_id: "abc123", tags: [2] }),
      machineActions.untag({ system_id: "abc123", tags: [1] }),
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
            clearHeaderContent={jest.fn()}
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
            clearHeaderContent={jest.fn()}
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
            clearHeaderContent={jest.fn()}
            machines={machines}
            processingCount={0}
            viewingDetails={false}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  // Mock state.tag.saved transitioning from "false" to "true"
  mockFormikFormSaved();
  await userEvent.click(screen.getByLabelText(TagFormFieldsLabel.TagInput));
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
