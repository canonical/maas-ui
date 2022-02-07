import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ReservedRangeForm from "./ReservedRangeForm";

import { actions as ipRangeActions } from "app/store/iprange";
import type { IPRange } from "app/store/iprange/types";
import { IPRangeType } from "app/store/iprange/types";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  ipRange as ipRangeFactory,
  ipRangeState as ipRangeStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ReservedRangeForm", () => {
  let state: RootState;
  let ipRange: IPRange;

  beforeEach(() => {
    ipRange = ipRangeFactory({
      comment: "what a beaut",
      start_ip: "11.1.1.1",
      type: IPRangeType.Reserved,
      user: "wombat",
    });
    state = rootStateFactory({
      iprange: ipRangeStateFactory({
        items: [ipRange],
      }),
    });
  });

  it("displays a spinner when it is editing and data is loading", () => {
    state.iprange.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm onClose={jest.fn()} id={ipRange.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("Spinner")).toBeInTheDocument();
  });

  it("does not display a spinner when it is not in edit mode", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm onClose={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryAllByTestId("Spinner")).toHaveLength(0);
  });

  it("initialises the reserved range details when editing", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm onClose={jest.fn()} id={ipRange.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("textbox", { name: "Start IP address" })
    ).toHaveAttribute("value", ipRange.start_ip);
    expect(
      screen.getByRole("textbox", { name: "End IP address" })
    ).toHaveAttribute("value", ipRange.end_ip);
    expect(screen.getByRole("textbox", { name: "Purpose" })).toHaveAttribute(
      "value",
      ipRange.comment
    );
  });

  it("initialises the details when editing a dynamic range", () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm onClose={jest.fn()} id={ipRange.id} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByRole("textbox", { name: "Purpose" })).toHaveAttribute(
      "value",
      "Dynamic"
    );
    expect(screen.getByRole("textbox", { name: "Purpose" })).toHaveAttribute(
      "disabled"
    );
  });

  it("dispatches an action to update a reserved range", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm onClose={jest.fn()} id={ipRange.id} />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => fireEvent.submit(screen.getByRole("form")));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: ipRange.start_ip,
    });
    expect(
      store.getActions().find((action) => action.type === expected.type)
    ).toStrictEqual(expected);
  });

  it("resets the comment when updating a dynamic range", async () => {
    ipRange.type = IPRangeType.Dynamic;
    state.iprange.items = [ipRange];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm onClose={jest.fn()} id={ipRange.id} />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => fireEvent.submit(screen.getByRole("form")));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: ipRange.start_ip,
    });
    const actual = store
      .getActions()
      .find((action) => action.type === expected.type);
    expect(actual.payload.params.comment).toBe(expected.payload.params.comment);
  });
});
