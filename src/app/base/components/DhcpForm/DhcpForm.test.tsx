import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import { Labels as FieldLabels } from "../DhcpFormFields";

import DhcpForm, { Labels } from "./DhcpForm";

import { actions as dhcpActions } from "app/store/dhcpsnippet";
import dhcpsnippetSelectors from "app/store/dhcpsnippet/selectors";
import type { RootState } from "app/store/root/types";
import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DhcpForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        items: [
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 1,
            name: "lease",
            updated: "Thu, 15 Aug. 2019 06:21:39",
            value: "lease 10",
          }),
          dhcpSnippetFactory({
            created: "Thu, 15 Aug. 2019 06:21:39",
            id: 2,
            name: "class",
            updated: "Thu, 15 Aug. 2019 06:21:39",
          }),
        ],
        loaded: true,
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("cleans up when unmounting", async () => {
    const store = mockStore(state);
    const { unmount } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    unmount();

    const expectedAction = dhcpActions.cleanup();
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can update a snippet", async () => {
    const dhcpSnippet = state.dhcpsnippet.items[0];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" id={dhcpSnippet.id} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: FieldLabels.Name })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: FieldLabels.Name }),
      "new-lease"
    );
    await userEvent.click(screen.getByRole("button", { name: Labels.Submit }));

    const expectedAction = dhcpActions.update({
      description: dhcpSnippet.description,
      enabled: dhcpSnippet.enabled,
      id: dhcpSnippet.id,
      name: "new-lease",
      value: dhcpSnippet.value,
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can create a snippet", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: FieldLabels.Name }),
      "new-lease"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: FieldLabels.Description }),
      "new-description"
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: FieldLabels.Enabled })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: FieldLabels.Value }),
      "new-value"
    );
    await userEvent.click(screen.getByRole("button", { name: Labels.Submit }));

    const expectedAction = dhcpActions.create({
      description: "new-description",
      enabled: true,
      name: "new-lease",
      value: "new-value",
    });
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can call the onSave on success", async () => {
    state.dhcpsnippet.saved = false;
    const onSave = jest.fn();
    const store = mockStore(state);
    const Proxy = ({ analyticsCategory }: { analyticsCategory: string }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm analyticsCategory={analyticsCategory} onSave={onSave} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy analyticsCategory="settings" />);

    await userEvent.type(
      screen.getByRole("textbox", { name: FieldLabels.Name }),
      "new-lease"
    );
    await userEvent.click(screen.getByRole("button", { name: Labels.Submit }));
    jest.spyOn(dhcpsnippetSelectors, "saved").mockReturnValue(true);
    rerender(<Proxy analyticsCategory="new-value" />);

    expect(onSave).toHaveBeenCalled();
  });

  it("does not call onSave if there is an error", async () => {
    state.dhcpsnippet.errors = "Uh oh!";
    const onSave = jest.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" onSave={onSave} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: FieldLabels.Name }),
      "new-lease"
    );
    await userEvent.click(screen.getByRole("button", { name: Labels.Submit }));

    expect(onSave).not.toHaveBeenCalled();
  });

  it("adds a message when a snippet is added", () => {
    state.dhcpsnippet.saved = true;
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm analyticsCategory="settings" />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "dhcpsnippet/cleanup")
    ).toBe(true);
    expect(actions.some((action) => action.type === "message/add")).toBe(true);
  });

  it("fetches models when editing", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm
              analyticsCategory="settings"
              id={state.dhcpsnippet.items[0].id}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions.some((action) => action.type === "machine/fetch")).toBe(
      true
    );
    expect(actions.some((action) => action.type === "device/fetch")).toBe(true);
    expect(actions.some((action) => action.type === "subnet/fetch")).toBe(true);
    expect(actions.some((action) => action.type === "controller/fetch")).toBe(
      true
    );
  });

  it("shows a spinner when loading models", () => {
    state.subnet.loading = true;
    state.device.loading = true;
    state.controller.loading = true;
    state.machine.loading = true;
    state.subnet.loaded = false;
    state.device.loaded = false;
    state.controller.loaded = false;
    state.machine.loaded = false;
    const store = mockStore(state);
    state.dhcpsnippet.items[0].node = "xyz";
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <DhcpForm
              analyticsCategory="settings"
              id={state.dhcpsnippet.items[0].id}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("alert", { name: Labels.LoadingData })
    ).toBeInTheDocument();
  });
});
