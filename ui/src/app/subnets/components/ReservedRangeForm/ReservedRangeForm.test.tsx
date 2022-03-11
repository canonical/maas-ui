import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ReservedRangeForm, { Labels } from "./ReservedRangeForm";

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
    expect(screen.queryByTestId("Spinner")).not.toBeInTheDocument();
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
      screen.getByRole("textbox", { name: Labels.StartIp })
    ).toHaveAttribute("value", ipRange.start_ip);
    expect(screen.getByRole("textbox", { name: Labels.EndIp })).toHaveAttribute(
      "value",
      ipRange.end_ip
    );
    expect(
      screen.getByRole("textbox", { name: Labels.Comment })
    ).toHaveAttribute("value", ipRange.comment);
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
    expect(
      screen.getByRole("textbox", { name: Labels.Comment })
    ).toHaveAttribute("value", "Dynamic");
    expect(
      screen.getByRole("textbox", { name: Labels.Comment })
    ).toHaveAttribute("disabled");
  });

  it("dispatches an action to create a reserved range", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm
            createType={IPRangeType.Reserved}
            onClose={jest.fn()}
            subnetId={1}
          />
        </MemoryRouter>
      </Provider>
    );
    userEvent.type(
      screen.getByRole("textbox", { name: Labels.StartIp }),
      "1.1.1.1"
    );
    userEvent.type(
      screen.getByRole("textbox", { name: Labels.EndIp }),
      "1.1.1.2"
    );
    userEvent.type(
      screen.getByRole("textbox", { name: Labels.Comment }),
      "reserved"
    );
    fireEvent.submit(screen.getByRole("form"));
    const expected = ipRangeActions.create({
      comment: "reserved",
      end_ip: "1.1.1.2",
      start_ip: "1.1.1.1",
      subnet: 1,
      type: IPRangeType.Reserved,
    });
    await waitFor(() =>
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected)
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
    fireEvent.submit(screen.getByRole("form"));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: ipRange.start_ip,
    });
    await waitFor(() =>
      expect(
        store.getActions().find((action) => action.type === expected.type)
      ).toStrictEqual(expected)
    );
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
    fireEvent.submit(screen.getByRole("form"));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: ipRange.start_ip,
    });
    await waitFor(() => {
      const actual = store
        .getActions()
        .find((action) => action.type === expected.type);
      expect(actual.payload.params.comment).toBe(
        expected.payload.params.comment
      );
    });
  });

  it("does not display the Comment field when creating a dynamic range", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <ReservedRangeForm
            createType={IPRangeType.Dynamic}
            onClose={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.queryByRole("textbox", { name: Labels.Comment })
    ).not.toBeInTheDocument();
  });
});
