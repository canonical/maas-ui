import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import KernelOptionsField, { Label } from "./KernelOptionsField";

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
  await waitFor(() => {
    expect(
      screen.getByText(/The new kernel options will not be applied/i)
    ).toBeInTheDocument();
  });
});

it("displays a deployed machines message when passed machines", async () => {
  const machines = [
    machineFactory({
      status: NodeStatus.DEPLOYED,
      tags: [1],
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <KernelOptionsField deployedMachines={machines} />
        </Formik>
      </MemoryRouter>
    </Provider>
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.KernelOptions }),
    "options2"
  );
  await waitFor(() => {
    expect(
      screen.getByText(/The new kernel options will not be applied/i)
    ).toBeInTheDocument();
  });
});

it("can display a provided deployed machines message", async () => {
  const machines = [
    machineFactory({
      status: NodeStatus.DEPLOYED,
      tags: [1],
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <KernelOptionsField
            deployedMachines={machines}
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
  await waitFor(() => {
    expect(screen.getByText(/1 deployed machine/i)).toBeInTheDocument();
  });
});
