import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import FetchedImages, { Labels as FetchedImagesLabels } from "./FetchedImages";

import { actions as bootResourceActions } from "app/store/bootresource";
import { BootResourceSourceType } from "app/store/bootresource/types";
import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  bootResourceFetchedArch as fetchedArchFactory,
  bootResourceFetchedImages as fetchedImagesFactory,
  bootResourceFetchedRelease as fetchedReleaseFactory,
  bootResourceState as bootResourceStateFactory,
  bootResourceUbuntuSource as sourceFactory,
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

jest.mock("@canonical/react-components/dist/hooks", () => ({
  ...jest.requireActual("@canonical/react-components/dist/hooks"),
  usePrevious: jest.fn(),
}));

const mockStore = configureStore();

describe("FetchedImages", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("can dispatch an action to save fetched ubuntu images", async () => {
    const source = sourceFactory({
      keyring_data: "abcde",
      keyring_filename: "/path/to/file",
      source_type: BootResourceSourceType.CUSTOM,
      url: "www.url.com",
    });
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        fetchedImages: fetchedImagesFactory({
          arches: [fetchedArchFactory()],
          releases: [fetchedReleaseFactory()],
        }),
      }),
    });
    state.bootresource = bootResourceStateFactory({
      fetchedImages: fetchedImagesFactory({
        arches: [fetchedArchFactory()],
        releases: [fetchedReleaseFactory()],
      }),
    });
    const store = mockStore(state);
    renderWithMockStore(
      <MemoryRouter>
        <CompatRouter>
          <FetchedImages closeForm={jest.fn()} source={source} />
        </CompatRouter>
      </MemoryRouter>,
      { store }
    );

    await userEvent.click(screen.getByRole("radio", { name: "16.04 LTS" }));
    await userEvent.click(
      screen.getByRole("button", { name: FetchedImagesLabels.SubmitLabel })
    );

    const expectedAction = bootResourceActions.saveUbuntu({
      keyring_data: "abcde",
      keyring_filename: "/path/to/file",
      osystems: [
        {
          arches: ["amd64"],
          osystem: "ubuntu",
          release: "xenial",
        },
      ],
      source_type: BootResourceSourceType.CUSTOM,
      url: "www.url.com",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("closes the fetched images form when successfully saved", async () => {
    // Mock the transition from "saving" to "saved"
    jest
      .spyOn(reactComponentHooks, "usePrevious")
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    const source = sourceFactory();
    const closeForm = jest.fn();
    state.bootresource = bootResourceStateFactory({
      fetchedImages: fetchedImagesFactory({
        arches: [fetchedArchFactory()],
        releases: [fetchedReleaseFactory()],
      }),
    });
    const store = mockStore(state);
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FetchedImages closeForm={closeForm} source={source} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(screen.getByRole("radio", { name: "16.04 LTS" }));
    await userEvent.click(
      screen.getByRole("button", { name: FetchedImagesLabels.SubmitLabel })
    );

    // Force the component to rerender to simulate the saved value changing.
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FetchedImages closeForm={closeForm} source={source} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(closeForm).toHaveBeenCalled());
  });
});
