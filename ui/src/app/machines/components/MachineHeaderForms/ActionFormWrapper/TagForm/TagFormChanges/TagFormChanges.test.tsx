import { render, screen } from "@testing-library/react";
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
      items: [tagFactory({ id: 1 }), tagFactory({ id: 2 })],
    }),
  });
});

it("displays a message if there are no tags", () => {
  state.machine.items[0].tags = [];
  state.machine.items[1].tags = [];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <TagFormChanges machines={state.machine.items} />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText(Label.NoTags)).toBeInTheDocument();
  expect(screen.queryByLabelText(Label.Manual)).not.toBeInTheDocument();
  expect(screen.queryByLabelText(Label.Automatic)).not.toBeInTheDocument();
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
  expect(screen.getByLabelText(Label.Manual)).toBeInTheDocument();
  expect(screen.queryByTestId(TestId.Border)).not.toBeInTheDocument();
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
  expect(screen.getByLabelText(Label.Automatic)).toBeInTheDocument();
  expect(screen.queryByTestId(TestId.Border)).not.toBeInTheDocument();
});

it("displays a border if there are both manual and automatic tags", () => {
  state.tag.items[0].definition = "def1";
  state.tag.items[1].definition = "";
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <TagFormChanges machines={state.machine.items} />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByLabelText(Label.Automatic)).toBeInTheDocument();
  expect(screen.getByLabelText(Label.Manual)).toBeInTheDocument();
  expect(screen.getByTestId(TestId.Border)).toBeInTheDocument();
});
