import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import MapSubnet from "./MapSubnet";

import { actions as subnetActions } from "app/store/subnet";
import {
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("shows a spinner while subnet is loading", () => {
  const state = rootStateFactory({ subnet: subnetStateFactory({ items: [] }) });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <MapSubnet id={1} setActiveForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading-subnet")).toBeInTheDocument();
});

it("shows an error if the subnet is IPv6", () => {
  const subnet = subnetFactory({ version: 6 });
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <MapSubnet id={subnet.id} setActiveForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(
    screen.getByText("Only IPv4 subnets can be scanned.")
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Map subnet" })).toBeDisabled();
});

it("can map an IPv4 subnet", async () => {
  const subnet = subnetFactory({ version: 4 });
  const state = rootStateFactory({
    subnet: subnetStateFactory({ items: [subnet] }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <MapSubnet id={subnet.id} setActiveForm={jest.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(screen.getByRole("button", { name: "Map subnet" }));

  await waitFor(() => {
    const expectedAction = subnetActions.scan(subnet.id);
    const actualActions = store.getActions();

    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
