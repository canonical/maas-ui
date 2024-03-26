import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ReservedRangeForm, { Labels } from "./ReservedRangeForm";

import { ipRangeActions } from "@/app/store/iprange";
import type { IPRange } from "@/app/store/iprange/types";
import { IPRangeType } from "@/app/store/iprange/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  render,
  screen,
  waitFor,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("ReservedRangeForm", () => {
  let state: RootState;
  let ipRange: IPRange;

  beforeEach(() => {
    ipRange = factory.ipRange({
      comment: "what a beaut",
      start_ip: "11.1.1.1",
      type: IPRangeType.Reserved,
      user: "wombat",
    });
    state = factory.rootState({
      iprange: factory.ipRangeState({
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
          <ReservedRangeForm ipRangeId={ipRange.id} setActiveForm={vi.fn()} />
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
          <ReservedRangeForm setActiveForm={vi.fn()} />
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
          <ReservedRangeForm ipRangeId={ipRange.id} setActiveForm={vi.fn()} />
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
          <ReservedRangeForm ipRangeId={ipRange.id} setActiveForm={vi.fn()} />
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
            id={1}
            setActiveForm={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.StartIp }),
      "1.1.1.1"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.EndIp }),
      "1.1.1.2"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: Labels.Comment }),
      "reserved"
    );
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
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
          <ReservedRangeForm ipRangeId={ipRange.id} setActiveForm={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const startIpField = screen.getByRole("textbox", { name: Labels.StartIp });
    await userEvent.clear(startIpField);
    await userEvent.type(startIpField, "1.2.3.4");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: "1.2.3.4",
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
          <ReservedRangeForm ipRangeId={ipRange.id} setActiveForm={vi.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const startIpField = screen.getByRole("textbox", { name: Labels.StartIp });
    await userEvent.clear(startIpField);
    await userEvent.type(startIpField, "1.2.3.4");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    const expected = ipRangeActions.update({
      comment: ipRange.comment,
      end_ip: ipRange.end_ip,
      id: ipRange.id,
      start_ip: "1.2.3.4",
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
            setActiveForm={vi.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.queryByRole("textbox", { name: Labels.Comment })
    ).not.toBeInTheDocument();
  });

  it("displays an error when start and end IP addresses are not provided", async () => {
    renderWithBrowserRouter(<ReservedRangeForm setActiveForm={vi.fn()} />, {
      state,
      route: "/machines",
    });
    await userEvent.click(
      screen.getByRole("textbox", { name: Labels.StartIp })
    );
    await userEvent.click(screen.getByRole("textbox", { name: Labels.EndIp }));
    await userEvent.click(screen.getByRole("button", { name: "Reserve" }));
    expect(
      await screen.findByLabelText(Labels.StartIp)
    ).toHaveAccessibleErrorMessage(/Start IP is required/);
    expect(
      await screen.findByLabelText(Labels.EndIp)
    ).toHaveAccessibleErrorMessage(/End IP is required/);
  });
});
