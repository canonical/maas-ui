import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MaasIntroSuccess, {
  Labels as MaasIntroSuccessLabels,
} from "./MaasIntroSuccess";

import urls from "@/app/base/urls";
import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import {
  userEvent,
  screen,
  renderWithBrowserRouter,
  renderWithMockStore,
} from "@/testing/utils";

const mockStore = configureStore<RootState, {}>();

describe("MaasIntroSuccess", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({ name: ConfigNames.COMPLETED_INTRO, value: false }),
        ],
      }),
      user: factory.userState({
        auth: factory.authState({
          user: factory.user({ completed_intro: false, is_superuser: false }),
        }),
      }),
    });
  });

  it("links to the user intro if not yet completed", () => {
    state.user.auth = factory.authState({
      user: factory.user({ completed_intro: false }),
    });
    renderWithBrowserRouter(<MaasIntroSuccess />, {
      route: "/intro/success",
      state,
    });
    expect(
      screen.getByRole("link", { name: MaasIntroSuccessLabels.FinishSetup })
    ).toHaveAttribute("href", urls.intro.user);
  });

  it("links to the machine list if an admin that has completed the user intro", () => {
    state.user.auth = factory.authState({
      user: factory.user({ completed_intro: true, is_superuser: true }),
    });
    renderWithBrowserRouter(<MaasIntroSuccess />, {
      route: "/intro/success",
      state,
    });
    expect(
      screen.getByRole("link", { name: MaasIntroSuccessLabels.FinishSetup })
    ).toHaveAttribute("href", urls.machines.index);
  });

  it("links to the machine list if a non-admin that has completed the user intro", () => {
    state.user.auth = factory.authState({
      user: factory.user({ completed_intro: true, is_superuser: false }),
    });
    renderWithBrowserRouter(<MaasIntroSuccess />, {
      route: "/intro/success",
      state,
    });
    expect(
      screen.getByRole("link", { name: MaasIntroSuccessLabels.FinishSetup })
    ).toHaveAttribute("href", urls.machines.index);
  });

  it("dispatches an action to update completed intro config", async () => {
    const store = mockStore(state);
    renderWithMockStore(
      <MemoryRouter
        initialEntries={[{ pathname: "/intro/success", key: "testKey" }]}
      >
        <CompatRouter>
          <MaasIntroSuccess />
        </CompatRouter>
      </MemoryRouter>,
      { store }
    );

    await userEvent.click(
      screen.getByRole("link", { name: MaasIntroSuccessLabels.FinishSetup })
    );

    const expectedAction = configActions.update({ completed_intro: true });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
