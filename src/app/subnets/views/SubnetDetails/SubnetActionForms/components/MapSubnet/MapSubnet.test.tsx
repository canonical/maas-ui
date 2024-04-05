import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MapSubnet from "./MapSubnet";

import { subnetActions } from "@/app/store/subnet";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

it("shows a spinner while subnet is loading", () => {
  const state = factory.rootState({
    subnet: factory.subnetState({ items: [] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MapSubnet setSidePanelContent={vi.fn()} subnetId={1} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading-subnet")).toBeInTheDocument();
});

it("shows an error if the subnet is IPv6", () => {
  const subnet = factory.subnet({ version: 6 });
  const state = factory.rootState({
    subnet: factory.subnetState({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MapSubnet setSidePanelContent={vi.fn()} subnetId={subnet.id} />
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText("Only IPv4 subnets can be scanned.")
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Map subnet" })).toBeDisabled();
});

it("can map an IPv4 subnet", async () => {
  const subnet = factory.subnet({ version: 4 });
  const state = factory.rootState({
    subnet: factory.subnetState({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MapSubnet setSidePanelContent={vi.fn()} subnetId={subnet.id} />
      </MemoryRouter>
    </Provider>
  );

  await userEvent.click(screen.getByRole("button", { name: "Map subnet" }));

  await waitFor(() => {
    const expectedAction = subnetActions.scan(subnet.id);
    const actualActions = store.getActions();

    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
