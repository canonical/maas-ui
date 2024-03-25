import { Provider } from "react-redux";
import { MemoryRouter, CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { Headers } from "./BootArchitecturesTable";
import EditBootArchitectures from "./EditBootArchitectures";

import { subnetActions } from "@/app/store/subnet";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor, within } from "@/testing/utils";

const mockStore = configureStore();

it("shows a spinner while data is loading", () => {
  const state = factory.rootState({
    general: factory.generalState({
      knownBootArchitectures: factory.knownBootArchitecturesState({
        loading: true,
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={1} setActiveForm={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading-data")).toBeInTheDocument();
});

it("initialises form data correctly", () => {
  const knownBootArchitectures = [
    factory.knownBootArchitecture({ name: "arch1" }),
    factory.knownBootArchitecture({ name: "arch2" }),
  ];
  const subnet = factory.subnet({
    disabled_boot_architectures: ["arch1"],
  });
  const state = factory.rootState({
    general: factory.generalState({
      knownBootArchitectures: factory.knownBootArchitecturesState({
        data: knownBootArchitectures,
        loading: false,
      }),
    }),
    subnet: factory.subnetState({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={subnet.id} setActiveForm={vi.fn()} />
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
    factory.knownBootArchitecture({ name: "arch1" }),
    factory.knownBootArchitecture({ name: "arch2" }),
  ];
  const subnet = factory.subnet({
    disabled_boot_architectures: ["arch1"],
  });
  const state = factory.rootState({
    general: factory.generalState({
      knownBootArchitectures: factory.knownBootArchitecturesState({
        data: knownBootArchitectures,
        loading: false,
      }),
    }),
    subnet: factory.subnetState({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={subnet.id} setActiveForm={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const nameCells = screen.getAllByRole("gridcell", { name: Headers.Name });

  await userEvent.click(within(nameCells[0]).getByRole("checkbox"));
  await userEvent.click(within(nameCells[1]).getByRole("checkbox"));

  await waitFor(() =>
    expect(within(nameCells[0]).getByRole("checkbox")).toBeChecked()
  );
  expect(within(nameCells[1]).getByRole("checkbox")).not.toBeChecked();
});

it("can dispatch an action to update subnet's disabled boot architectures", async () => {
  const knownBootArchitectures = [
    factory.knownBootArchitecture({ name: "arch1" }),
    factory.knownBootArchitecture({ name: "arch2" }),
  ];
  const subnet = factory.subnet({
    disabled_boot_architectures: [],
  });
  const state = factory.rootState({
    general: factory.generalState({
      knownBootArchitectures: factory.knownBootArchitecturesState({
        data: knownBootArchitectures,
        loading: false,
      }),
    }),
    subnet: factory.subnetState({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <EditBootArchitectures id={subnet.id} setActiveForm={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  const nameCells = screen.getAllByRole("gridcell", { name: Headers.Name });

  await userEvent.click(within(nameCells[0]).getByRole("checkbox"));
  await userEvent.click(within(nameCells[1]).getByRole("checkbox"));

  await userEvent.click(screen.getByRole("button", { name: "Save" }));

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
