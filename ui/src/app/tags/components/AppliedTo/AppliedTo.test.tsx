import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
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
    `${machineURLs.machines.index}?tags=a-tag`
  );
  expect(controllerLink).toHaveAttribute(
    "href",
    `${controllerURLs.controllers.index}?tags=a-tag`
  );
  expect(deviceLink).toHaveAttribute(
    "href",
    `${deviceURLs.devices.index}?tags=a-tag`
  );
});
