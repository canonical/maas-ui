import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CustomSourceConnect from "./CustomSourceConnect";

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

describe("CustomSourceConnect", () => {
  it("can set source url and dispatch an action to fetch images from a custom source", () => {
    const setSourceUrl = jest.fn();
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CustomSourceConnect
          setConnected={jest.fn()}
          setSourceUrl={setSourceUrl}
        />
      </Provider>
    );
    wrapper.find("Formik").invoke("onSubmit")({
      keyring_data: "data",
      keyring_filename: "/path/to/file",
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
    expect(setSourceUrl).toHaveBeenCalledWith("http://www.example.com/");
  });

  it("sets connected state if images successfuly fetched from source", () => {
    // Mock the transition from "saving" to "saved"
    jest
      .spyOn(reactComponentHooks, "usePrevious")
      .mockImplementation(() => true);
    const setConnected = jest.fn();
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        eventErrors: [],
        statuses: bootResourceStatusesFactory({ fetching: false }),
      }),
    });
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <CustomSourceConnect
          setConnected={setConnected}
          setSourceUrl={jest.fn()}
        />
      </Provider>
    );

    expect(setConnected).toHaveBeenCalledWith(true);
  });
});
