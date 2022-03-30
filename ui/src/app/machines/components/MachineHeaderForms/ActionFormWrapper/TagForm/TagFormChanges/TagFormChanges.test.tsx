import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagFormChanges, { Label } from "./TagFormChanges";

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
      items: [tagFactory({ id: 1 }), tagFactory({ id: 2 })],
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
        <TagFormChanges machines={state.machine.items} />
      </MemoryRouter>
    </Provider>
  );
  const labelCell = screen.getByRole("cell", { name: Label.Manual });
  expect(labelCell).toBeInTheDocument();
  expect(labelCell).toHaveAttribute("rowSpan", "2");
});

it("displays automatic tags", () => {
  state.tag.items[0].definition = "def1";
  state.tag.items[1].definition = "def2";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <TagFormChanges machines={state.machine.items} />
      </MemoryRouter>
    </Provider>
  );
  const labelCell = screen.getByRole("cell", {
    name: new RegExp(Label.Automatic),
  });
  expect(labelCell).toBeInTheDocument();
  expect(labelCell).toHaveAttribute("rowSpan", "2");
});

it("displays a tag details modal when chips are clicked", () => {
  state.tag.items[0].name = "tag1";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <TagFormChanges machines={state.machine.items} />
      </MemoryRouter>
    </Provider>
  );
  userEvent.click(screen.getByRole("button", { name: "tag1 (2/2)" }));
  expect(screen.getByRole("dialog", { name: "tag1" })).toBeInTheDocument();
});
