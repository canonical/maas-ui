import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DomainListHeaderForm, {
  Labels as DomainListHeaderFormLabels,
} from "./DomainListHeaderForm";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore();

describe("DomainListHeaderForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = jest.fn();
    renderWithBrowserRouter(<DomainListHeaderForm closeForm={closeForm} />, {
      state,
    });

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls domainActions.create on save click", async () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <DomainListHeaderForm closeForm={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: DomainListHeaderFormLabels.Name }),
      "some-domain"
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: DomainListHeaderFormLabels.SubmitLabel,
      })
    );

    expect(
      store.getActions().find((action) => action.type === "domain/create")
    ).toStrictEqual({
      type: "domain/create",
      meta: {
        method: "create",
        model: "domain",
      },
      payload: {
        params: {
          authoritative: true,
          name: "some-domain",
        },
      },
    });
  });
});
