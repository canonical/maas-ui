import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import FetchImagesForm from "./FetchImagesForm";

import { actions as bootResourceActions } from "app/store/bootresource";
import { BootResourceSourceType } from "app/store/bootresource/types";
import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.mock("@canonical/react-components/dist/hooks", () => ({
  usePrevious: jest.fn(),
}));

describe("FetchImagesForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("can dispatch an action to fetch images", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <FetchImagesForm closeForm={jest.fn()} setSource={jest.fn()} />
      </Provider>
    );
    wrapper.find("Formik").invoke("onSubmit")({
      keyring_data: "data",
      keyring_filename: "/path/to/file",
      source_type: BootResourceSourceType.CUSTOM,
      url: "http://www.example.com/",
    });

    const actualActions = store.getActions();
    const expectedAction = bootResourceActions.fetch({
      keyring_data: "data",
      keyring_filename: "/path/to/file",
      source_type: BootResourceSourceType.CUSTOM,
      url: "http://www.example.com/",
    });
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });

  it("sets source if images successfuly fetched", () => {
    // Mock the transition from "saving" to "saved"
    jest
      .spyOn(reactComponentHooks, "usePrevious")
      .mockReturnValueOnce(false)
      .mockReturnValue(true);
    const setSource = jest.fn();
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        eventErrors: [],
        statuses: bootResourceStatusesFactory({ fetching: false }),
      }),
    });
    const store = mockStore(state);
    const Proxy = () => (
      <Provider store={store}>
        <FetchImagesForm closeForm={jest.fn()} setSource={setSource} />
      </Provider>
    );
    const wrapper = mount(<Proxy />);
    // Force the component to rerender to simulate the saved value changing.
    wrapper.setProps({});

    expect(setSource).toHaveBeenCalled();
  });
});
