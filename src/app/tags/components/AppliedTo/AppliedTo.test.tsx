import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import AppliedTo from "./AppliedTo";

import controllerURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
import tagURLs from "app/tags/urls";
import {
  rootState as rootStateFactory,
  tag as tagFactory,
  tagState as tagStateFactory,
} from "testing/factories";

const mockStore = configureStore();
let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    tag: tagStateFactory({
      items: [
        tagFactory({
          name: "rad",
        }),
      ],
    }),
  });
});

it("links to nodes", () => {
  state.tag.items = [
    tagFactory({
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
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <AppliedTo id={1} />
        </CompatRouter>
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
    `${machineURLs.index}?tags=%3Da-tag`
  );
  expect(controllerLink).toHaveAttribute(
    "href",
    `${controllerURLs.index}?tags=%3Da-tag`
  );
  expect(deviceLink).toHaveAttribute(
    "href",
    `${deviceURLs.index}?tags=%3Da-tag`
  );
});

it("displays a message if there are no nodes", () => {
  state.tag.items = [
    tagFactory({
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
        initialEntries={[{ pathname: tagURLs.tag.index({ id: 1 }) }]}
      >
        <CompatRouter>
          <AppliedTo id={1} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  expect(screen.getByText("None")).toBeInTheDocument();
});
