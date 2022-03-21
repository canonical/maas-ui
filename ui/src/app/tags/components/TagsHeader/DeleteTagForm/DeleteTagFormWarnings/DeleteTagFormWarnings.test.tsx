import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteTagFormWarnings from "./DeleteTagFormWarnings";

import type { RootState } from "app/store/root/types";
import {
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [tagFactory({ id: 1 })],
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("displays warning when deleting a tag with kernel options", async () => {
  state.tag.items = [
    tagFactory({
      id: 1,
      kernel_opts: "opts",
      machine_count: 4,
      name: "tag1",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <DeleteTagFormWarnings id={1} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/You are deleting a tag with kernel options/i)
  ).toBeInTheDocument();
});

it("displays warning when deleting a tag applied to devices", async () => {
  state.tag.items = [
    tagFactory({
      device_count: 1,
      id: 1,
      name: "tag1",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <DeleteTagFormWarnings id={1} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/There is 1 device with this tag/i)
  ).toBeInTheDocument();
});

it("displays warning when deleting a tag applied to controllers", async () => {
  state.tag.items = [
    tagFactory({
      controller_count: 1,
      id: 1,
      name: "tag1",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <DeleteTagFormWarnings id={1} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/There is 1 controller with this tag/i)
  ).toBeInTheDocument();
});

it("generates the correct sentence for multiple nodes", async () => {
  state.tag.items = [
    tagFactory({
      controller_count: 2,
      id: 1,
      name: "tag1",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <DeleteTagFormWarnings id={1} />
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/There are 2 controllers with this tag/i)
  ).toBeInTheDocument();
});
