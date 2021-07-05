import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FetchedImages from "./FetchedImages";

import { actions as bootResourceActions } from "app/store/bootresource";
import { BootResourceSourceType } from "app/store/bootresource/types";
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

jest.mock("@canonical/react-components/dist/hooks", () => ({
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
            name: "commissioning_distro_series",
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

  it("can dispatch an action to save fetched ubuntu images", () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <FetchedImages closeForm={jest.fn()} source={source} />
      </Provider>
    );
    wrapper.find("Formik").invoke("onSubmit")({
      images: [
        { arch: "amd64", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
        { arch: "amd64", os: "ubuntu", release: "bionic", title: "18.04 LTS" },
        { arch: "i386", os: "ubuntu", release: "xenial", title: "16.04 LTS" },
      ],
    });

    const expectedAction = bootResourceActions.saveUbuntu({
      keyring_data: "abcde",
      keyring_filename: "/path/to/file",
      osystems: [
        {
          arches: ["amd64", "i386"],
          osystem: "ubuntu",
          release: "xenial",
        },
        {
          arches: ["amd64"],
          osystem: "ubuntu",
          release: "bionic",
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

  it("closes the fetched images form when successfully saved", () => {
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
    const Proxy = () => (
      <Provider store={store}>
        <FetchedImages closeForm={closeForm} source={source} />
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    // Force the component to rerender to simulate the saved value changing.
    wrapper.setProps({});

    expect(closeForm).toHaveBeenCalled();
  });
});
