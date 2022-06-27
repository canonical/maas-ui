import { render, screen, within } from "@testing-library/react";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FabricSelect, { Label } from "./FabricSelect";

import type { RootState } from "app/store/root/types";
import {
  fabric as fabricFactory,
  fabricState as fabricStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FabricSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      fabric: fabricStateFactory({
        items: [],
        loaded: true,
      }),
    });
  });

  it("is disabled if the fabrics haven't loaded", () => {
    state.fabric.loaded = false;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect name="fabric" />
        </Formik>
      </Provider>
    );

    expect(screen.getByRole("combobox", { name: Label.Select })).toBeDisabled();
  });

  it("displays the fabric options", () => {
    const items = [
      fabricFactory({ id: 1, name: "FABric1" }),
      fabricFactory({ id: 2, name: "FABric2" }),
    ];
    state.fabric.items = items;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect name="fabric" />
        </Formik>
      </Provider>
    );
    const options = screen.getAllByRole("option");

    expect(options[0]).toBeDisabled();
    expect(options[0]).toHaveValue("");
    expect(
      within(options[0]).getByText(Label.DefaultOption)
    ).toBeInTheDocument();
    expect(options[1]).toHaveValue(items[0].id.toString());
    expect(within(options[1]).getByText(items[0].name)).toBeInTheDocument();
    expect(options[2]).toHaveValue(items[1].id.toString());
    expect(within(options[2]).getByText(items[1].name)).toBeInTheDocument();
  });

  it("can display a default option", () => {
    const store = mockStore(state);
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    render(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect defaultOption={defaultOption} name="fabric" />
        </Formik>
      </Provider>
    );
    const options = screen.getAllByRole("option");

    expect(options[0]).toHaveValue(defaultOption.value);
    expect(
      within(options[0]).getByText(defaultOption.label)
    ).toBeInTheDocument();
  });

  it("can hide the default option", () => {
    state.fabric.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect defaultOption={null} name="fabric" />
        </Formik>
      </Provider>
    );
    const options = screen.queryAllByRole("option");

    expect(options.length).toBe(0);
  });

  it("orders the fabrics by name", () => {
    const items = [
      fabricFactory({ id: 1, name: "FABric2" }),
      fabricFactory({ id: 2, name: "FABric1" }),
    ];
    state.fabric.items = items;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{ fabric: "" }} onSubmit={jest.fn()}>
          <FabricSelect name="fabric" />
        </Formik>
      </Provider>
    );
    const options = screen.getAllByRole("option");

    expect(within(options[1]).getByText(items[1].name)).toBeInTheDocument();
    expect(within(options[2]).getByText(items[0].name)).toBeInTheDocument();
  });
});
