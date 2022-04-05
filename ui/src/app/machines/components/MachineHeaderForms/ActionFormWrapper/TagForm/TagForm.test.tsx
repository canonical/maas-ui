import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagForm from "./TagForm";
import { Label as TagFormChangesLabel } from "./TagFormChanges";
import { Label as TagFormFieldsLabel } from "./TagFormFields";

import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

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
        <TagForm
          clearHeaderContent={jest.fn()}
          machines={[]}
          processingCount={0}
          viewingDetails={false}
        />
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
        <TagForm
          clearHeaderContent={jest.fn()}
          machines={machines}
          processingCount={0}
          viewingDetails={false}
        />
      </MemoryRouter>
    </Provider>
  );

  userEvent.click(screen.getByLabelText(TagFormFieldsLabel.TagInput));
  userEvent.click(screen.getByRole("option", { name: "tag1" }));
  userEvent.click(screen.getByRole("option", { name: "tag2" }));
  userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.tag({ systemId: "abc123", tags: [1, 2] }),
      machineActions.tag({ systemId: "def456", tags: [1, 2] }),
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
        <TagForm
          clearHeaderContent={jest.fn()}
          machines={machines}
          processingCount={0}
          viewingDetails={false}
        />
      </MemoryRouter>
    </Provider>
  );

  const deleteButtons = screen.getAllByRole("button", {
    name: TagFormChangesLabel.Remove,
  });
  userEvent.click(deleteButtons[0]);
  userEvent.click(deleteButtons[1]);
  userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.untag({ systemId: "abc123", tags: [1, 2] }),
      machineActions.untag({ systemId: "def456", tags: [1, 2] }),
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
        <TagForm
          clearHeaderContent={jest.fn()}
          machines={machines}
          processingCount={0}
          viewingDetails={false}
        />
      </MemoryRouter>
    </Provider>
  );

  userEvent.click(screen.getByLabelText(TagFormFieldsLabel.TagInput));
  userEvent.click(screen.getByRole("option", { name: "tag2" }));
  userEvent.click(
    screen.getByRole("button", { name: TagFormChangesLabel.Remove })
  );
  userEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => {
    const expectedActions = [
      machineActions.tag({ systemId: "abc123", tags: [2] }),
      machineActions.untag({ systemId: "abc123", tags: [1] }),
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
