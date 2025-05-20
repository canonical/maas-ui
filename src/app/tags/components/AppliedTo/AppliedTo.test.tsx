import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import configureStore from "redux-mock-store";

import AppliedTo from "./AppliedTo";

import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    tag: factory.tagState({
      items: [
        factory.tag({
          name: "rad",
        }),
      ],
    }),
  });
});

it("links to nodes", () => {
  state.tag.items = [
    factory.tag({
      id: 1,
      machine_count: 1,
      device_count: 2,
      controller_count: 3,
      name: "a-tag",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <AppliedTo id={1} />
      </MemoryRouter>
    </Provider>
  );
  const machineLink = screen.getByRole("link", {
    name: "1 machine",
  });
  const deviceLink = screen.getByRole("link", {
    name: "2 devices",
  });
  const controllerLink = screen.getByRole("link", {
    name: "3 controllers",
  });
  expect(machineLink).toBeInTheDocument();
  expect(controllerLink).toBeInTheDocument();
  expect(deviceLink).toBeInTheDocument();
  expect(machineLink).toHaveAttribute(
    "href",
    `${urls.machines.index}?tags=%3Da-tag`
  );
  expect(controllerLink).toHaveAttribute(
    "href",
    `${urls.controllers.index}?tags=%3Da-tag`
  );
  expect(deviceLink).toHaveAttribute(
    "href",
    `${urls.devices.index}?tags=%3Da-tag`
  );
});

it("displays a message if there are no nodes", () => {
  state.tag.items = [
    factory.tag({
      id: 1,
      machine_count: 0,
      device_count: 0,
      controller_count: 0,
      name: "a-tag",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: urls.tags.tag.index({ id: 1 }) }]}
      >
        <AppliedTo id={1} />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  expect(screen.getByText("None")).toBeInTheDocument();
});
