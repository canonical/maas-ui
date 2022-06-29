import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DeleteTagFormWarnings from "./DeleteTagFormWarnings";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    machine: machineStateFactory({
      items: [
        machineFactory({
          status: NodeStatus.DEPLOYED,
          tags: [1],
        }),
      ],
    }),
    tag: tagStateFactory({
      items: [tagFactory({ id: 1 })],
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("does not display a kernel options warning for non-deployed machines", async () => {
  state.tag.items = [
    tagFactory({
      id: 1,
      kernel_opts: "opts",
      machine_count: 4,
      name: "tag1",
    }),
  ];
  state.machine.items = [
    machineFactory({
      status: NodeStatus.ALLOCATED,
      tags: [1],
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.queryByText(/You are deleting a tag with kernel options/i)
  ).not.toBeInTheDocument();
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
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/You are deleting a tag with kernel options/i)
  ).toBeInTheDocument();
});

it("displays a kernel options warning with multiple machines", async () => {
  state.machine.items.push(
    machineFactory({
      status: NodeStatus.DEPLOYED,
      tags: [1],
    })
  );
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
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/There are 2 deployed machines with this tag/i)
  ).toBeInTheDocument();
});

it("displays a kernel options warning with one machine", async () => {
  state.tag.items = [
    tagFactory({
      id: 1,
      kernel_opts: "opts",
      machine_count: 1,
      name: "tag1",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/tags", key: "testKey" }]}>
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/There is 1 deployed machine with this tag/i)
  ).toBeInTheDocument();
});

it("links to a page to display deployed machines", async () => {
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
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByRole("link", { name: "Show the deployed machine" })
  ).toHaveAttribute("href", urls.tags.tag.machines({ id: 1 }));
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
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
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
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
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
        <CompatRouter>
          <DeleteTagFormWarnings id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.getByText(/There are 2 controllers with this tag/i)
  ).toBeInTheDocument();
});
