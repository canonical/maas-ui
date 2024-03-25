import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { APIKeyForm, Label as APIKeyFormLabels } from "./APIKeyForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithMockStore,
} from "@/testing/utils";

const mockStore = configureStore();

describe("APIKeyForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      token: factory.tokenState({
        loading: false,
        loaded: true,
        items: [
          factory.token({
            id: 1,
            key: "ssh-rsa aabb",
            consumer: { key: "abc", name: "Name" },
          }),
        ],
      }),
    });
  });

  it("can render", () => {
    renderWithMockStore(
      <MemoryRouter initialEntries={["/"]}>
        <CompatRouter>
          <APIKeyForm />
        </CompatRouter>
      </MemoryRouter>,
      { state }
    );
    expect(screen.getByRole("form", { name: APIKeyFormLabels.AddFormLabel }));
  });

  it("can create an API key", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <APIKeyForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: APIKeyFormLabels.AddNameLabel }),
      "Token name"
    );

    await userEvent.click(
      screen.getByRole("button", { name: APIKeyFormLabels.AddSubmit })
    );

    expect(
      store.getActions().find((action) => action.type === "token/create")
    ).toStrictEqual({
      type: "token/create",
      payload: {
        params: {
          name: "Token name",
        },
      },
      meta: {
        model: "token",
        method: "create",
      },
    });
  });

  it("can update an API key", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <CompatRouter>
            <APIKeyForm token={state.token.items[0]} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: APIKeyFormLabels.EditNameLabel })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: APIKeyFormLabels.EditNameLabel }),
      "New token name"
    );

    await userEvent.click(
      screen.getByRole("button", { name: APIKeyFormLabels.EditSubmit })
    );
    expect(
      store.getActions().find((action) => action.type === "token/update")
    ).toStrictEqual({
      type: "token/update",
      payload: {
        params: {
          id: 1,
          name: "New token name",
        },
      },
      meta: {
        model: "token",
        method: "update",
      },
    });
  });
});
