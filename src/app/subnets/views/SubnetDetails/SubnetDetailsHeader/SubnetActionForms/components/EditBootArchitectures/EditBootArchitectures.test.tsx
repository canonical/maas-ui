import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Headers } from "./BootArchitecturesTable";
import EditBootArchitectures from "./EditBootArchitectures";

import { actions as subnetActions } from "app/store/subnet";
import {
  knownBootArchitecture as knownBootArchitectureFactory,
  knownBootArchitecturesState as knownBootArchitecturesStateFactory,
  generalState as generalStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("shows a spinner while data is loading", () => {
  const state = rootStateFactory({
    general: generalStateFactory({
      knownBootArchitectures: knownBootArchitecturesStateFactory({
        loading: true,
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={1} setActiveForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading-data")).toBeInTheDocument();
});

it("initialises form data correctly", () => {
  const knownBootArchitectures = [
    knownBootArchitectureFactory({ name: "arch1" }),
    knownBootArchitectureFactory({ name: "arch2" }),
  ];
  const subnet = subnetFactory({
    disabled_boot_architectures: ["arch1"],
  });
  const state = rootStateFactory({
    general: generalStateFactory({
      knownBootArchitectures: knownBootArchitecturesStateFactory({
        data: knownBootArchitectures,
        loading: false,
      }),
    }),
    subnet: subnetStateFactory({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={subnet.id} setActiveForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const nameCells = screen.getAllByRole("gridcell", { name: Headers.Name });

  // First arch is disabled, second arch is not.
  expect(within(nameCells[0]).getByRole("checkbox")).not.toBeChecked();
  expect(within(nameCells[1]).getByRole("checkbox")).toBeChecked();
});

it("can update the arches to disable", async () => {
  const knownBootArchitectures = [
    knownBootArchitectureFactory({ name: "arch1" }),
    knownBootArchitectureFactory({ name: "arch2" }),
  ];
  const subnet = subnetFactory({
    disabled_boot_architectures: ["arch1"],
  });
  const state = rootStateFactory({
    general: generalStateFactory({
      knownBootArchitectures: knownBootArchitecturesStateFactory({
        data: knownBootArchitectures,
        loading: false,
      }),
    }),
    subnet: subnetStateFactory({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={subnet.id} setActiveForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const nameCells = screen.getAllByRole("gridcell", { name: Headers.Name });

  fireEvent.click(within(nameCells[0]).getByRole("checkbox"));
  fireEvent.click(within(nameCells[1]).getByRole("checkbox"));

  await waitFor(() =>
    expect(within(nameCells[0]).getByRole("checkbox")).toBeChecked()
  );
  expect(within(nameCells[1]).getByRole("checkbox")).not.toBeChecked();
});

it("can dispatch an action to update subnet's disabled boot architectures", async () => {
  const knownBootArchitectures = [
    knownBootArchitectureFactory({ name: "arch1" }),
    knownBootArchitectureFactory({ name: "arch2" }),
  ];
  const subnet = subnetFactory({
    disabled_boot_architectures: [],
  });
  const state = rootStateFactory({
    general: generalStateFactory({
      knownBootArchitectures: knownBootArchitecturesStateFactory({
        data: knownBootArchitectures,
        loading: false,
      }),
    }),
    subnet: subnetStateFactory({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={subnet.id} setActiveForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const nameCells = screen.getAllByRole("gridcell", { name: Headers.Name });

  fireEvent.click(within(nameCells[0]).getByRole("checkbox"));
  fireEvent.click(within(nameCells[1]).getByRole("checkbox"));

  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  const expectedAction = subnetActions.update({
    id: subnet.id,
    disabled_boot_architectures: "arch1, arch2",
  });

  await waitFor(() => {
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
