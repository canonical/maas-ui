import * as reduxToolkit from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DeleteTagFormWarnings from "./DeleteTagFormWarnings";

import urls from "@/app/base/urls";
import * as query from "@/app/store/machine/utils/query";
import type { RootState } from "@/app/store/root/types";
import { NodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;

const callId = "mocked-nanoid";
vi.mock("@reduxjs/toolkit", async () => {
  const actual: object = await vi.importActual("@reduxjs/toolkit");
  return {
    ...actual,
    nanoid: vi.fn(),
  };
});

beforeEach(() => {
  vi.spyOn(reduxToolkit, "nanoid").mockReturnValue("{}");
  vi.spyOn(query, "generateCallId").mockReturnValue("mocked-nanoid");
  state = factory.rootState({
    machine: factory.machineState({
      items: [
        factory.machine({
          status: NodeStatus.DEPLOYED,
          tags: [1],
        }),
      ],
    }),
    tag: factory.tagState({
      items: [factory.tag({ id: 1 })],
    }),
  });
});

it("does not display a kernel options warning for non-deployed machines", async () => {
  state.tag.items = [
    factory.tag({
      id: 1,
      kernel_opts: "opts",
      machine_count: 4,
      name: "tag1",
    }),
  ];
  state.machine.items = [
    factory.machine({
      status: NodeStatus.ALLOCATED,
      tags: [1],
    }),
  ];
  state.machine.counts = {
    [callId]: factory.machineStateCount({
      count: 0,
      loaded: true,
    }),
  };
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
    factory.tag({
      id: 1,
      kernel_opts: "opts",
      machine_count: 4,
      name: "tag1",
    }),
  ];
  state.machine.counts = {
    [callId]: factory.machineStateCount({
      count: 1,
      loaded: true,
    }),
  };
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
    factory.machine({
      status: NodeStatus.DEPLOYED,
      tags: [1],
    })
  );
  state.tag.items = [
    factory.tag({
      id: 1,
      kernel_opts: "opts",
      machine_count: 4,
      name: "tag1",
    }),
  ];
  state.machine.counts = {
    [callId]: factory.machineStateCount({
      count: 2,
      loaded: true,
    }),
  };
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
    factory.tag({
      id: 1,
      kernel_opts: "opts",
      machine_count: 1,
      name: "tag1",
    }),
  ];
  state.machine.counts = {
    [callId]: factory.machineStateCount({
      count: 1,
      loaded: true,
    }),
  };
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
    factory.tag({
      id: 1,
      kernel_opts: "opts",
      machine_count: 4,
      name: "tag1",
    }),
  ];
  state.machine.counts = {
    [callId]: factory.machineStateCount({
      count: 1,
      loaded: true,
    }),
  };
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
    factory.tag({
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
    factory.tag({
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
    factory.tag({
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
