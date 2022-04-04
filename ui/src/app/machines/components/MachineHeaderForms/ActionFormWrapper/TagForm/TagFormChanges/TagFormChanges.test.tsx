import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagFormChanges, { Label, TestId } from "./TagFormChanges";

import type { RootState } from "app/store/root/types";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    machine: machineStateFactory({
      items: [machineFactory({ tags: [1] }), machineFactory({ tags: [1, 2] })],
    }),
    tag: tagStateFactory({
      items: [
        tagFactory({ id: 1, name: "tag1" }),
        tagFactory({ id: 2, name: "tag2" }),
      ],
    }),
  });
});

it("displays manual tags", () => {
  state.tag.items[0].definition = "";
  state.tag.items[1].definition = "";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
          <TagFormChanges machines={state.machine.items} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const labelCell = screen.getByRole("cell", { name: Label.Manual });
  expect(labelCell).toBeInTheDocument();
  expect(labelCell).toHaveAttribute("rowSpan", "2");
  expect(screen.getByRole("row", { name: "tag1" })).toHaveAttribute(
    "data-testid",
    TestId.Manual
  );
  expect(screen.getByRole("row", { name: "tag2" })).toHaveAttribute(
    "data-testid",
    TestId.Manual
  );
});

it("displays automatic tags", () => {
  state.tag.items[0].definition = "def1";
  state.tag.items[1].definition = "def2";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
          <TagFormChanges machines={state.machine.items} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const labelCell = screen.getByRole("cell", {
    name: new RegExp(Label.Automatic),
  });
  expect(labelCell).toBeInTheDocument();
  expect(labelCell).toHaveAttribute("rowSpan", "2");
  expect(screen.getByRole("row", { name: "tag1" })).toHaveAttribute(
    "data-testid",
    TestId.Auto
  );
  expect(screen.getByRole("row", { name: "tag2" })).toHaveAttribute(
    "data-testid",
    TestId.Auto
  );
});

it("displays added tags", () => {
  state.machine.items[0].tags = [];
  const tags = state.tag.items;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialValues={{ added: [tags[0].id, tags[1].id], removed: [] }}
          onSubmit={jest.fn()}
        >
          <TagFormChanges machines={[state.machine.items[0]]} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const labelCell = screen.getByRole("cell", {
    name: new RegExp(Label.Added),
  });
  expect(labelCell).toBeInTheDocument();
  expect(labelCell).toHaveAttribute("rowSpan", "2");
  expect(screen.getByRole("row", { name: "tag1" })).toHaveAttribute(
    "data-testid",
    TestId.Added
  );
  expect(screen.getByRole("row", { name: "tag2" })).toHaveAttribute(
    "data-testid",
    TestId.Added
  );
});

it("discards added tags", async () => {
  state.machine.items[0].tags = [];
  const tags = state.tag.items;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialValues={{ added: [tags[0].id, tags[1].id], removed: [] }}
          onSubmit={jest.fn()}
        >
          <TagFormChanges machines={[state.machine.items[0]]} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const row = screen.getByRole("row", { name: "tag1" });
  expect(row).toHaveAttribute("data-testid", TestId.Added);
  userEvent.click(within(row).getByRole("button", { name: Label.Discard }));
  await waitFor(() => {
    expect(screen.queryByRole("row", { name: "tag1" })).not.toBeInTheDocument();
  });
});

it("displays a tag details modal when chips are clicked", () => {
  state.tag.items[0].name = "tag1";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
          <TagFormChanges machines={state.machine.items} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  userEvent.click(screen.getByRole("button", { name: "tag1 (2/2)" }));
  expect(screen.getByRole("dialog", { name: "tag1" })).toBeInTheDocument();
});

it("can remove manual tags", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{ added: [], removed: [] }} onSubmit={jest.fn()}>
          <TagFormChanges machines={state.machine.items} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const tagName = "tag1";
  const manualRow = screen.getByRole("row", { name: tagName });
  expect(manualRow).toHaveAttribute("data-testid", TestId.Manual);
  userEvent.click(
    within(manualRow).getByRole("button", { name: Label.Remove })
  );
  // Get the tag's new row.
  const updatedRow = screen.getByRole("row", { name: tagName });
  await waitFor(() =>
    expect(updatedRow).toHaveAttribute("data-testid", TestId.Removed)
  );
});

it("displays removed tags", () => {
  state.machine.items[0].tags = [];
  const tags = state.tag.items;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialValues={{ added: [], removed: [tags[0].id, tags[1].id] }}
          onSubmit={jest.fn()}
        >
          <TagFormChanges machines={[state.machine.items[0]]} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const labelCell = screen.getByRole("cell", {
    name: new RegExp(Label.Removed),
  });
  expect(labelCell).toBeInTheDocument();
  expect(labelCell).toHaveAttribute("rowSpan", "2");
  expect(screen.getByRole("row", { name: "tag1" })).toHaveAttribute(
    "data-testid",
    TestId.Removed
  );
  expect(screen.getByRole("row", { name: "tag2" })).toHaveAttribute(
    "data-testid",
    TestId.Removed
  );
});

it("discards removed tags", async () => {
  const tags = state.tag.items;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik
          initialValues={{ added: [], removed: [tags[0].id, tags[1].id] }}
          onSubmit={jest.fn()}
        >
          <TagFormChanges machines={[state.machine.items[0]]} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const row = screen.getByRole("row", { name: "tag1" });
  expect(row).toHaveAttribute("data-testid", TestId.Removed);
  userEvent.click(within(row).getByRole("button", { name: Label.Discard }));
  await waitFor(() => {
    expect(screen.queryByRole("row", { name: "tag1" })).toHaveAttribute(
      "data-testid",
      TestId.Manual
    );
  });
});
