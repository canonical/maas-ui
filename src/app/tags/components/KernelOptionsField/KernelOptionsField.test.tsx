import reduxToolkit from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KernelOptionsField, { Label } from "./KernelOptionsField";

import { actions as machineActions } from "app/store/machine";
import type { FetchFilters } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { FetchNodeStatus, NodeStatus } from "app/store/types/node";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  machineStateCount as machineStateCountFactory,
  machineStateCounts as machineStateCountsFactory,
  tag as tagFactory,
  rootState as rootStateFactory,
  tagState as tagStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("mocked-nanoid");
  state = rootStateFactory({
    machine: machineStateFactory({
      counts: machineStateCountsFactory({
        "mocked-nanoid": machineStateCountFactory({
          count: 1,
          loaded: true,
        }),
      }),
    }),
    tag: tagStateFactory({
      items: [
        tagFactory({
          id: 1,
          name: "rad",
        }),
      ],
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("does not display a deployed machines message if a tag is not supplied", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <KernelOptionsField />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  expect(
    screen.queryByText(/The new kernel options will not be applied/i)
  ).not.toBeInTheDocument();
});

it("displays a deployed machines message when updating a tag", async () => {
  state = rootStateFactory({
    machine: machineStateFactory({
      items: [
        machineFactory({
          status: NodeStatus.DEPLOYED,
          tags: [1],
        }),
      ],
      counts: machineStateCountsFactory({
        "mocked-nanoid": machineStateCountFactory({
          count: 1,
          loaded: true,
          loading: false,
        }),
      }),
    }),
    tag: tagStateFactory({
      items: [tagFactory({ id: 1, machine_count: 1 })],
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <KernelOptionsField id={1} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.KernelOptions }),
    "options2"
  );

  expect(
    screen.getByText(/There is 1 deployed machine with this tag./i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/The new kernel options will not be applied/i)
  ).toBeInTheDocument();
});

it("displays a deployed machines message when passed deployedMachinesCount", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <KernelOptionsField deployedMachinesCount={1} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.KernelOptions }),
    "options2"
  );
  expect(
    screen.getByText(/The new kernel options will not be applied/i)
  ).toBeInTheDocument();
});

it("fetches deployed machine count for selected tag when not passed deployedMachinesCount", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <KernelOptionsField id={state.tag.items[0].id} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  const expected = machineActions.count("mocked-nanoid", {
    status: FetchNodeStatus.DEPLOYED,
    tags: [state.tag.items[0].name],
  } as FetchFilters);
  const actual = store
    .getActions()
    .find((action) => action.type === expected.type);
  expect(actual).toStrictEqual(expected);
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.KernelOptions }),
    "options2"
  );
  expect(
    screen.getByText(/The new kernel options will not be applied/i)
  ).toBeInTheDocument();
});

it("can display a provided deployed machines message", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <KernelOptionsField
            deployedMachinesCount={1}
            generateDeployedMessage={(count) => `${count} deployed machine`}
          />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.KernelOptions }),
    "options2"
  );
  expect(screen.getByText(/1 deployed machine/i)).toBeInTheDocument();
});
