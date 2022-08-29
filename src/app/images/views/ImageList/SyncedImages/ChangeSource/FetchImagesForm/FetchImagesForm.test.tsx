import * as reactComponentHooks from "@canonical/react-components/dist/hooks";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import FetchImagesForm, {
  Labels as FetchImagesFormLabels,
} from "./FetchImagesForm";
import { Labels as FetchImagesFormFieldsLabels } from "./FetchImagesFormFields/FetchImagesFormFields";

import { actions as bootResourceActions } from "app/store/bootresource";
import { BootResourceSourceType } from "app/store/bootresource/types";
import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

jest.mock("@canonical/react-components/dist/hooks", () => ({
  useId: jest.fn(),
  usePrevious: jest.fn(),
}));

describe("FetchImagesForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("can dispatch an action to fetch images", async () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <FetchImagesForm closeForm={jest.fn()} setSource={jest.fn()} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("radio", { name: FetchImagesFormFieldsLabels.Custom })
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: FetchImagesFormFieldsLabels.ShowAdvanced,
      })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: FetchImagesFormFieldsLabels.Url }),
      "http://www.example.com/"
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringFilename,
      }),
      "/path/to/file"
    );
    await userEvent.type(
      screen.getByRole("textbox", {
        name: FetchImagesFormFieldsLabels.KeyringData,
      }),
      "data"
    );

    await userEvent.click(
      screen.getByRole("button", { name: FetchImagesFormLabels.SubmitLabel })
    );

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

  it("sets source if images successfuly fetched", async () => {
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
        <MemoryRouter>
          <CompatRouter>
            <FetchImagesForm closeForm={jest.fn()} setSource={setSource} />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy />);

    await userEvent.click(
      screen.getByRole("button", { name: FetchImagesFormLabels.SubmitLabel })
    );

    // Force the component to rerender to simulate the saved value changing.
    rerender(<Proxy />);

    await waitFor(() => expect(setSource).toHaveBeenCalled());
  });
});
