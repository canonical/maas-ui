import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import TagList, { Label } from "./TagList";

import controllerURLs from "app/controllers/urls";
import deviceURLs from "app/devices/urls";
import machineURLs from "app/machines/urls";
import type { RootState } from "app/store/root/types";
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
        tagFactory({
          name: "cool",
        }),
      ],
    }),
  });
});

it("displays tags", () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagList />
      </MemoryRouter>
    </Provider>
  );
  const names = screen.queryAllByRole("gridcell", {
    name: Label.Name,
  });
  expect(names).toHaveLength(2);
  expect(names.find((td) => td.textContent === "rad")).toBeInTheDocument();
  expect(names.find((td) => td.textContent === "cool")).toBeInTheDocument();
});

it("shows an icon for automatic tags", () => {
  state.tag.items = [tagFactory({ definition: "automatic" })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagList />
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Auto,
  });
  expect(auto.querySelector(".p-icon--success-grey")).toBeInTheDocument();
});

it("does not show an icon for manual tags", () => {
  state.tag.items = [tagFactory({ definition: undefined })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagList />
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Auto,
  });
  expect(auto.querySelector(".p-icon--success-grey")).not.toBeInTheDocument();
});

it("shows an icon for kernel options", () => {
  state.tag.items = [tagFactory({ kernel_opts: "i'm a kernel option" })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagList />
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Options,
  });
  expect(auto.querySelector(".p-icon--success-grey")).toBeInTheDocument();
});

it("does not show an icon for tags without kernel options", () => {
  state.tag.items = [tagFactory({ kernel_opts: undefined })];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagList />
      </MemoryRouter>
    </Provider>
  );
  const auto = screen.getByRole("gridcell", {
    name: Label.Options,
  });
  expect(auto.querySelector(".p-icon--success-grey")).not.toBeInTheDocument();
});

it("can link to nodes", () => {
  state.tag.items = [
    tagFactory({
      machine_count: 1,
      device_count: 2,
      controller_count: 3,
      name: "a-tag",
    }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[{ pathname: "/" }]}>
        <TagList />
      </MemoryRouter>
    </Provider>
  );
  const appliedTo = screen.getByRole("gridcell", {
    name: Label.AppliedTo,
  });
  const machineLink = within(appliedTo).getByRole("link", {
    name: "1 machine",
  });
  const deviceLink = within(appliedTo).getByRole("link", {
    name: "2 devices",
  });
  const controllerLink = within(appliedTo).getByRole("link", {
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
