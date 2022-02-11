import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SpaceSelect from "./SpaceSelect";

import type { RootState } from "app/store/root/types";
import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    space: spaceStateFactory({
      items: [],
      loaded: false,
    }),
  });
});

it("is disabled if spaces haven't loaded", () => {
  state.space.loaded = false;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Formik initialValues={{ space: "" }} onSubmit={jest.fn()}>
        <SpaceSelect name="space" />
      </Formik>
    </Provider>
  );
  expect(screen.getByRole("combobox", { name: "Space" })).toBeDisabled();
  expect(
    screen.getByRole("option", { name: "Select space", selected: true })
  ).toBeDisabled();
});

it("renders options correctly", async () => {
  const space = spaceFactory({ id: 1, name: "space1" });
  state.space.items = [space];
  state.space.loaded = true;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Formik initialValues={{ space: "" }} onSubmit={jest.fn()}>
        <SpaceSelect name="space" />
      </Formik>
    </Provider>
  );

  const allOptions: HTMLOptionElement[] = screen.getAllByRole("option");
  expect(allOptions).toHaveLength(2);

  const defaultOption = screen.getByRole("option", {
    name: "Select space",
    selected: true,
  });
  expect(defaultOption).toBeInTheDocument();
  expect(defaultOption).toBeDisabled();
  expect(defaultOption).toHaveValue("");

  const option = screen.getByRole("option", {
    name: space.name,
    selected: false,
  });
  expect(defaultOption).toBeInTheDocument();
  expect(option).not.toBeDisabled();
  expect(option).toHaveValue(space.id.toString());
});

it("maintains selected option after new options are added", async () => {
  const SpaceWithProvider = ({ state }: { state: RootState }) => (
    <Provider store={mockStore(state)}>
      <Formik initialValues={{ space: "" }} onSubmit={jest.fn()}>
        <SpaceSelect name="space" />
      </Formik>
    </Provider>
  );
  const stateBefore = rootStateFactory({
    space: spaceStateFactory({
      items: [
        spaceFactory({ id: 1, name: "space1" }),
        spaceFactory({ id: 2, name: "space2" }),
        spaceFactory({ id: 3, name: "space3" }),
      ],
      loaded: true,
    }),
  });
  const stateAfter = rootStateFactory({
    space: spaceStateFactory({
      items: [
        spaceFactory({ id: 1, name: "space1" }),
        spaceFactory({ id: 2, name: "space2" }),
        spaceFactory({ id: 3, name: "space3" }),
        spaceFactory({ id: 4, name: "space4" }),
      ],
      loaded: true,
    }),
  });
  const { rerender } = render(<SpaceWithProvider state={stateBefore} />);

  userEvent.selectOptions(screen.getByRole("combobox"), ["space2"]);
  const option2 = screen.getByRole("option", {
    name: "space2",
  }) as HTMLOptionElement;

  await waitFor(() => expect(option2.selected).toBe(true));

  rerender(<SpaceWithProvider state={stateAfter} />);

  expect(option2.selected).toBe(true);
});

it("can hide the default option", () => {
  state.space.items = [];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Formik initialValues={{ space: "" }} onSubmit={jest.fn()}>
        <SpaceSelect name="space" defaultOption={null} />
      </Formik>
    </Provider>
  );
  expect(screen.queryAllByRole("option")).toHaveLength(0);
});

it("orders the spaces by name", () => {
  state.space.items = [
    spaceFactory({ id: 1, name: "space3" }),
    spaceFactory({ id: 2, name: "space1" }),
  ];
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Formik initialValues={{ space: "" }} onSubmit={jest.fn()}>
        <SpaceSelect name="space" />
      </Formik>
    </Provider>
  );
  const options = screen.queryAllByRole("option");
  expect(options[0].textContent).toBe("Select space");
  expect(options[1].textContent).toBe("space1");
  expect(options[2].textContent).toBe("space3");
});
