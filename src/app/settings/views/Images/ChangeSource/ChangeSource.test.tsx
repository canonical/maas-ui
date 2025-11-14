import configureStore from "redux-mock-store";
import { describe } from "vitest";

import ChangeSource from "@/app/settings/views/Images/ChangeSource/ChangeSource";
import { configActions } from "@/app/store/config";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ChangeSource", () => {
  it("dispatches an action to update config when changing the auto sync switch", async () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: true,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(<ChangeSource />, {
      store,
    });

    await userEvent
      .click(
        screen.getByRole("checkbox", { name: /Automatically sync images/i })
      )
      .then(async () => {
        await userEvent.click(screen.getByText("Save"));
      });

    const actualActions = store.getActions();
    const expectedAction = configActions.update({
      boot_images_auto_import: false,
    });

    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });

  it("disables the button to change source if resources are downloading", async () => {
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        resources: [factory.bootResource({ downloading: true })],
        ubuntu: factory.bootResourceUbuntu({
          sources: [factory.bootResourceUbuntuSource()],
        }),
      }),
    });
    renderWithBrowserRouter(<ChangeSource />, { state });
    expect(screen.getByRole("button", { name: "Save" })).toBeAriaDisabled();
    expect(
      screen.getByTestId("cannot-change-source-warning")
    ).toBeInTheDocument();
  });
});
