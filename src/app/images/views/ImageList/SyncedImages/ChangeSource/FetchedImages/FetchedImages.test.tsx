import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import FetchedImages, { Labels as FetchedImagesLabels } from "./FetchedImages";

import { bootResourceActions } from "@/app/store/bootresource";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, screen, render, waitFor } from "@/testing/utils";

vi.mock("@canonical/react-components/dist/hooks", () => ({
  ...vi.importActual("@canonical/react-components/dist/hooks"),
  usePrevious: vi.fn(),
}));

const mockStore = configureStore<RootState, {}>();

describe("FetchedImages", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.COMMISSIONING_DISTRO_SERIES,
            value: "focal",
          }),
        ],
      }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("can dispatch an action to save fetched ubuntu images", async () => {
    const source = factory.bootResourceUbuntuSource({
      keyring_data: "abcde",
      keyring_filename: "/path/to/file",
      source_type: BootResourceSourceType.CUSTOM,
      url: "www.url.com",
    });
    const state = factory.rootState({
      bootresource: factory.bootResourceState({
        fetchedImages: factory.bootResourceFetchedImages({
          arches: [factory.bootResourceFetchedArch()],
          releases: [factory.bootResourceFetchedRelease()],
        }),
      }),
    });
    state.bootresource = factory.bootResourceState({
      fetchedImages: factory.bootResourceFetchedImages({
        arches: [factory.bootResourceFetchedArch()],
        releases: [factory.bootResourceFetchedRelease()],
      }),
    });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FetchedImages closeForm={vi.fn()} source={source} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
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
    vi.spyOn(reactComponentHooks, "usePrevious")
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    const source = factory.bootResourceUbuntuSource();
    const closeForm = vi.fn();
    state.bootresource = factory.bootResourceState({
      fetchedImages: factory.bootResourceFetchedImages({
        arches: [factory.bootResourceFetchedArch()],
        releases: [factory.bootResourceFetchedRelease()],
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
