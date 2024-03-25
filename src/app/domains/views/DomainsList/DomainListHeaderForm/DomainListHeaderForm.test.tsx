import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DomainListHeaderForm, {
  Labels as DomainListHeaderFormLabels,
} from "./DomainListHeaderForm";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  render,
  renderWithBrowserRouter,
} from "@/testing/utils";

const mockStore = configureStore();

describe("DomainListHeaderForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState();
  });

  it("runs closeForm function when the cancel button is clicked", async () => {
    const closeForm = vi.fn();
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
            <DomainListHeaderForm closeForm={vi.fn()} />
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
